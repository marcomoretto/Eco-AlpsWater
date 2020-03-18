import os
import tarfile
import tempfile
import uuid
import zipfile
import io
from json import JSONDecodeError
import pytz
import shutil
from stat import S_IREAD, S_IRGRP, S_IROTH
import hashlib

from PIL import Image
import datetime
import json
from shutil import copyfile

from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from django.http import HttpResponse, Http404
from django.shortcuts import render
from django.contrib.auth.models import User
from django.db.models import Min

# Create your views here.
from EcoAlpsWater.lib.decorator import forward_exception_to_http, send_email_to_admin
from EcoAlpsWater.lib.email import send_email
from EcoAlpsWater.lib.models.biological_element import BiologicalElement
from EcoAlpsWater.lib.models.comment import Comment
from EcoAlpsWater.lib.models.depth_type import DepthType
from EcoAlpsWater.lib.models.dna_extraction_kit import DNAExtractionKit
from EcoAlpsWater.lib.models.dna_quantification_method import DNAQuantificationMethod
from EcoAlpsWater.lib.models.drainage_basin import DrainageBasin
from EcoAlpsWater.lib.models.eaw_user import EAWUser
from EcoAlpsWater.lib.models.edna_marker import EDNAMarker
from EcoAlpsWater.lib.models.field_description import FieldDescription
from EcoAlpsWater.lib.models.geographical_point import GeographicalPoint
from EcoAlpsWater.lib.models.mixing_type import MixingType
from EcoAlpsWater.lib.models.sample import Sample
from EcoAlpsWater.lib.models.sampling_matrix import SamplingMatrix
from EcoAlpsWater.lib.models.sampling_strategy import SamplingStrategy
from EcoAlpsWater.lib.models.station import Station
from EcoAlpsWater.lib.sample_coder import SampleCoder
from EcoAlpsWater.lib.models.tracking_comment import TrackingComment
from EcoAlpsWater.lib.models.sequence import Sequence

import barcode
from barcode.writer import ImageWriter
import xlsxwriter
import uuid


def request_logout(request):
    logout(request)
    return HttpResponse(json.dumps({'login': False}), content_type="application/json")


def check_login(request):
    user = request.user
    username = request.POST.get('username', None)
    password = request.POST.get('password', None)
    if not user.is_authenticated and username and password:
        user = authenticate(username=username, password=password)
    if user is not None and not user.is_anonymous and user.is_authenticated and user.is_active:
        login(request, user)
        return HttpResponse(
            json.dumps({
                'login': True
            }), content_type="application/json", status=200)
    else:
        return HttpResponse(
            json.dumps({
                'login': False
            }), content_type="application/json", status=401)


def send_verification_email(request):
    send_email(request.user.email,
        'Eco-AlpsWater verification e-mail',
        'This e-mail has been automatically sent from the Eco-AlpsWater website.'
    )
    return HttpResponse(
            json.dumps({
                'success': True
            }), content_type="application/json")


def get_stations(request):
    sort_property = 'id'
    sort_dir = 'ASC'
    if 'sort' in request.POST:
        sort = json.loads(request.POST.get('sort', '[{}]'))[0]
        sort_property = sort.get('property', 'id')
        sort_dir = sort.get('direction', 'ASC')
        if sort_property == 'water_body':
            sort_property = 'drainage_basin__type'
        elif sort_property == 'water_body_name':
            sort_property = 'drainage_basin__name'
        elif sort_property == 'station_type':
            sort_property = 'type'
    if request.user.is_superuser:
        rs = Station.objects.order_by('id').all()
    else:
        rs = Station.objects.filter(drainage_basin__country=request.user.eawuser.country).order_by('id').all()
    page = request.POST.get('page', 1)
    start = request.POST.get('start', 0)
    limit = request.POST.get('limit', rs.count())
    filter = request.POST.get('filter', '')
    st = int(start)
    en = st + int(limit)
    if filter:
        rs = rs.filter(
            Q(id__icontains=filter) |
            Q(drainage_basin__type__icontains=filter) |
            Q(drainage_basin__name__icontains=filter) |
            Q(name__icontains=filter) |
            Q(type__icontains=filter)
        )
    order = ''
    if sort_dir == 'DESC':
        order = '-'
    rs = rs.order_by(order + sort_property)
    if sort_property == 'latitude':
        rs = rs.annotate(cc=Min('geographicalpoint__latitude')).order_by(order + 'cc')
    if sort_property == 'longitude':
        rs = rs.annotate(cc=Min('geographicalpoint__longitude')).order_by(order + 'cc')
    rows = [s.to_dict() for s in rs[st:en]]
    total = rs.count()
    return HttpResponse(
            json.dumps({
                'success': True,
                'rows': rows,
                'total': total
            }), content_type="application/json")


@forward_exception_to_http
def excel_profile_file_upload(request):
    req = json.loads(request.POST['request'])
    sample_code = req['sample_code']
    file = request.FILES[req['template']]
    full_dir = os.path.join('/tmp/', sample_code)
    os.makedirs(full_dir, exist_ok=True)
    full_path = os.path.join(full_dir, req['template'] + '.xlsx')
    with open(full_path, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)

    return HttpResponse(json.dumps({'success': True}),
                        content_type="application/json")


def download_template(request):
    template_name = request.POST['name']
    file_path = settings.BASE_DIR + settings.STATIC_URL + 'EcoAlpsWater/template_files/' + template_name + '.xlsx'
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read())
            response['Content-Type'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            response['Content-Disposition'] = 'attachment; filename=' + template_name + '.xlsx'
            return response
    raise Http404


def get_combo_field_values(request):
    water_bodies = []
    for ty in DrainageBasin.TYPE:
        water_body = {'id': ty[0], 'name': ty[0], 'water_body_name': []}
        for db in DrainageBasin.objects.filter(country=request.user.eawuser.country, type=ty[0]):
            wb = db.to_dict()
            water_body['water_body_name'].append(wb)
        water_bodies.append(water_body)
    depth_type = [dt.to_dict() for dt in DepthType.objects.all()]
    edna_marker = [em.to_dict() for em in EDNAMarker.objects.all()]
    bio_element = [be.to_dict() for be in BiologicalElement.objects.all()]
    mixing_type = [m.to_dict() for m in MixingType.objects.all()]
    dna_extraction_kit = [ek.to_dict() for ek in DNAExtractionKit.objects.all()]
    dna_quantification_method = [qm.to_dict() for qm in DNAQuantificationMethod.objects.all()]
    sampling_matrix = [sm.to_dict() for sm in SamplingMatrix.objects.all()]
    sampling_strategy = [ss.to_dict() for ss in SamplingStrategy.objects.all()]
    values = {
        'water_body': water_bodies,
        'depth_type': depth_type,
        'edna_marker': edna_marker,
        'biological_element': bio_element,
        'sampling_matrix': sampling_matrix,
        'sampling_strategy': sampling_strategy,
        'mixing_type': mixing_type,
        'dna_extraction_kit': dna_extraction_kit,
        'dna_quantification_method': dna_quantification_method
    }
    return HttpResponse(
            json.dumps({
                'values': values
            }), content_type="application/json")


def get_field_descriptions(request):
    return HttpResponse(
            json.dumps({
                'descriptions': [fd.to_dict() for fd in FieldDescription.objects.all()]
            }), content_type="application/json")


def get_user_info(request):
    return HttpResponse(
            json.dumps({
                'user_info': {
                    'user_name': request.user.username,
                    'institute': request.user.eawuser.institute + " ({short})".format(short=request.user.eawuser.institute_short),
                    'e_mail': request.user.email
                }
            }), content_type="application/json")


@forward_exception_to_http
def change_password(request):
    old_password = request.POST['old_password']
    new_password = request.POST['new_password']
    if not request.user.check_password(old_password):
        raise Exception('Invalid password')
    request.user.set_password(new_password)
    request.user.save()
    return HttpResponse(
            json.dumps({
                'success': True
            }), content_type="application/json")


@forward_exception_to_http
def update_ids(request):
    biological_element = request.POST.get('biological_element', None) or None,
    depth_min = request.POST.get('sampling_depth_min', '') or ''
    depth_max = request.POST.get('sampling_depth_max', '') or ''
    depth_type = request.POST.get('depth_type', None) or None
    sampling_date = request.POST.get('sampling_date', None) or None,
    station = request.POST.get('station', None) or None
    sampling_matrix = request.POST.get('sampling_matrix', None) or None
    sampling_strategy = request.POST.get('sampling_strategy', None) or None

    sample_code = SampleCoder(
        biological_element[0],
        station,
        depth_min,
        depth_max,
        depth_type,
        sampling_date,
        sampling_matrix,
        sampling_strategy
    )

    cap_code = ''
    water_body_code = ''
    return HttpResponse(
            json.dumps({
                'success': True,
                'ids': {
                    'sample_id': sample_code.get_sample_id(),
                    'sample_code': sample_code.get_sample_code(),
                    'cap_code': cap_code,
                    'water_body_code': water_body_code
                }
            }), content_type="application/json")


@forward_exception_to_http
def get_search_field_name(request):
    fields = [{
        'id': 'sample_id',
        'name': 'Sample ID'
    }, {
        'id': 'sample_code',
        'name': 'Sample code'
    }, {
        'id': 'user__username',
        'name': 'User'
    }, {
        'id': 'user__eawuser__institute_short',
        'name': 'Institute'
    }, {
        'id': 'station__drainage_basin__type',
        'name': 'Water body type'
    }, {
        'id': 'station__drainage_basin__name',
        'name': 'Water body name'
    }, {
        'id': 'sampling_date',
        'name': 'Sampling date'
    }, {
        'id': 'station__name',
        'name': 'Station name'
    }, {
        'id': 'cap_code',
        'name': 'Cap code'
    }, {
        'id': 'sampling_depth_min',
        'name': 'Sampling depth min'
    }, {
        'id': 'sampling_depth_max',
        'name': 'Sampling depth max'
    }, {
        'id': 'sampling_volume',
        'name': 'Sampling volume'
    }, {
        'id': 'depth_type__name',
        'name': 'Depth type'
    }, {
        'id': 'mean_river_outflow',
        'name': 'Mean river outflow'
    }, {
        'id': 'mixing_type__name',
        'name': 'Mixing type'
    }, {
        'id': 'catchment_area',
        'name': 'Catchment area'
    }, {
        'id': 'sampling_matrix',
        'name': 'Sampling matrix'
    }, {
        'id': 'sampling_strategy',
        'name': 'Sampling strategy'
    }, {
        'id': 'temperature',
        'name': 'Temperature'
    }, {
        'id': 'field_ph',
        'name': 'Field pH'
    }, {
        'id': 'field_conductivity',
        'name': 'Field conductivity'
    }, {
        'id': 'light_attenuation_coefficient',
        'name': 'Light attenuation coefficient'
    }, {
        'id': 'secchi_disk_depth',
        'name': 'Secchi disk depth'
    }, {
        'id': 'euphotic_layer',
        'name': 'Euphotic layer'
    }, {
        'id': 'oxygen_concentration',
        'name': 'Oxygen concentration'
    }, {
        'id': 'oxygen_percentage',
        'name': 'Oxygen percentage'
    }, {
        'id': 'laboratory_ph',
        'name': 'Laboratory pH'
    }, {
        'id': 'laboratory_conductivity',
        'name': 'Laboratory conductivity'
    }, {
        'id': 'total_alkalinity',
        'name': 'Total alkalinity'
    }, {
        'id': 'bicarbonates',
        'name': 'Bicarbonates'
    }, {
        'id': 'nitrate_nitrogen',
        'name': 'Nitrate nitrogen (NO3-N)'
    }, {
        'id': 'sulphates',
        'name': 'Sulphates'
    }, {
        'id': 'chloride',
        'name': 'Chloride'
    }, {
        'id': 'calcium',
        'name': 'Calcium'
    }, {
        'id': 'magnesium',
        'name': 'Magnesium'
    }, {
        'id': 'sodium',
        'name': 'Sodium'
    }, {
        'id': 'potassium',
        'name': 'Potassium'
    }, {
        'id': 'ammonium',
        'name': 'Ammonium nitrogen (NH4-N)'
    }, {
        'id': 'total_nitrogen',
        'name': 'Total nitrogen'
    }, {
        'id': 'soluble_reactive_phosphorus',
        'name': 'Soluble reactive phosphorus'
    }, {
        'id': 'total_phosphorus',
        'name': 'Total phosphorus'
    }, {
        'id': 'reactive_silica',
        'name': 'Reactive silica'
    }, {
        'id': 'dry_weight',
        'name': 'Dry weight'
    }, {
        'id': 'chlorophyll_a',
        'name': 'Chlorophyll a'
    }, {
        'id': 'dna_extraction_kit__name',
        'name': 'DNA extraction kit'
    }, {
        'id': 'dna_quantification_method__name',
        'name': 'DNA quantification method'
    }, {
        'id': 'dna_extraction_date',
        'name': 'DNA extraction date'
    }]
    return HttpResponse(
            json.dumps({
                'success': True,
                'rows': fields,
                'total': len(fields)
            }), content_type="application/json")


def get_sequence(request, id, file=None):
    download_dir = os.path.join(os.environ['EAW_DOWNLOAD_DIRECTORY'], id)
    status_code = 401
    for (dirpath, dirnames, filenames) in os.walk(download_dir):
        for file in filenames:
            seq = Sequence.objects.filter(filename=file).first()
            if seq and (seq.sample.user.username == request.user.username or request.user.is_superuser):
                status_code = 200
                try:
                    user = request.user.username
                    title = 'Eco-AlpsWater admin notification'
                    message = '''
                        Dear admin,
                        user {user} has just downloaded sequence files from directory {dir}.
                        '''.format(user=user, dir=download_dir)
                    for admin in User.objects.filter(is_superuser=True):
                        send_email(admin.email, title, message)
                except Exception as e:
                    pass
                break
    return HttpResponse(json.dumps({}), status=status_code)


@send_email_to_admin('request_sequence')
@forward_exception_to_http
def request_sequence(request):
    samples = json.loads(request.POST['samples'])
    tot_files = 0
    for sample_id in samples:
        sample = Sample.objects.get(id=sample_id)
        tot_files += sample.sequence_set.all().count()
    if tot_files == 0:
        raise Exception('There are no files associated')
    dirname = str(uuid.uuid1().int>>64)
    os.mkdir(os.path.join(os.environ['EAW_DOWNLOAD_DIRECTORY'], dirname))
    outdir = os.environ['EAW_DOWNLOAD_DIRECTORY']
    indir = os.environ['EAW_VAULT_DIRECTORY']
    login = 'https://eco-alpswater.fmach.it/check_login/'
    location = 'https://eco-alpswater.fmach.it/download/{dirname}/'.format(dirname=dirname)
    for sample_id in samples:
        sample = Sample.objects.get(id=sample_id)
        for seq in sample.sequence_set.all():
            copyfile(
                os.path.join(indir, seq.filename),
                os.path.join(outdir, dirname, seq.filename)
            )
    send_email(request.user.email,
               'Eco-AlpsWater sequence file(s) ready',
               '''
        Dear {user},
        the sequence file(s) you requested are ready to be downloaded from the Eco-AlpsWater server using your credentials.
        Please note that all downloadable files get removed every day at midnight.
        
        You can user your browser to download files from {location}.
        
        If you prefer to use WGET you'll need to first login and save the cookie with your credentials
        
        wget -qO- --no-check-certificate --keep-session-cookies --save-cookies cookies.txt --post-data 'username={user}&password=<password>' {login}
        
        And then download files passing the cookie file
        
        wget -c -r --no-check-certificate --load-cookies cookies.txt {location}

        This e-mail has been automatically sent from the Eco-AlpsWater website.
               '''.format(user=request.user.username,
                          location=location,
                          login=login)
        )
    return HttpResponse(
        json.dumps({
            'success': True
        }), content_type="application/json")


def get_sample_sequence_file(request):
    sample = Sample.objects.get(id=request.POST['sample_id'][0])
    rs = sample.sequence_set.order_by('id').all()
    page = request.POST.get('page', 1)
    start = request.POST.get('start', 0)
    limit = request.POST.get('limit', rs.count())
    st = int(start)
    en = st + int(limit)
    rows = []
    for s in rs[st:en]:
        v = s.to_dict()
        rows.append(v)
    total = rs.count()
    return HttpResponse(
        json.dumps({
            'success': True,
            'rows': rows,
            'total': total
        }), content_type="application/json")


@forward_exception_to_http
def upload_complete(request):
    sample = Sample.objects.get(id=request.POST.get('sample_id', None))
    be = BiologicalElement.objects.get(id=request.POST.get('biological_element', None))
    edna = EDNAMarker.objects.get(id=request.POST.get('edna_marker', None))
    hash_md5 = hashlib.md5()
    with open(request.POST['sequence_file.path'], "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    md5 = hash_md5.hexdigest()
    file_md5 = False
    with open(request.POST['md5_checksum_file.path']) as f:
        for l in f:
            if l.startswith('#'):
                continue
            for s in l.strip().split():
                if s == md5:
                    file_md5 = True
                    break
    if not file_md5:
        raise Exception('MD5SUM mismatch, sequence file corrupted or wrong MD5')
    file_unique_id = uuid.uuid4()
    new_file_name = '{sample_code}_{be}_{edna}_{file_unique_id}_{org_name}'.format(
        sample_code=sample.sample_code,
        be=be.code,
        edna=edna.name,
        file_unique_id=file_unique_id,
        org_name=request.POST['sequence_file.name']
    )
    # move file
    full_name = os.path.join(os.environ['EAW_VAULT_DIRECTORY'], new_file_name)
    shutil.move(request.POST['sequence_file.path'], full_name)
    os.chmod(full_name, S_IREAD | S_IRGRP | S_IROTH)
    # add entry in db
    Sequence.objects.create(
        sample=sample,
        filename=new_file_name,
        original_filename=request.POST['sequence_file.name'],
        md5sum=md5
    )
    try:
        user = request.user.username
        title = 'Eco-AlpsWater admin notification'
        message = '''
            Dear admin,
            user {user} has just uploaded the sequence file {file} for sample {sample}.
            '''.format(user=user, file=request.POST['sequence_file.name'], sample=sample.sample_code)
        for admin in User.objects.filter(is_superuser=True):
            send_email(admin.email, title, message)
        send_email(request.user.email,
                   'Eco-AlpsWater sequence uploaded',
                   '''
           Dear {user},
           sequence file named {file} has been successfully uploaded for sample with code {sample_code}.

           This e-mail has been automatically sent from the Eco-AlpsWater website.
                   '''.format(user=request.user.username, file=request.POST['sequence_file.name'], sample_code=sample.sample_code)
                   )
    except Exception as e:
        pass
    return HttpResponse(json.dumps({'success': True}),
                        content_type="application/json")


@send_email_to_admin('add_tracking_comment')
@forward_exception_to_http
def add_tracking_comment(request):
    params = json.loads(request.POST['params'])
    tracking_comment = TrackingComment(
        user=request.user,
        sample_id=params['id'],
        comment=params['comment']
    )
    tracking_comment.save()
    return HttpResponse(
        json.dumps({
            'success': True
        }), content_type="application/json")


@forward_exception_to_http
def get_institutes_short_names(request):
    fields = [{'id': name, 'name': name} for name in EAWUser.objects.values_list('institute_short', flat=True).distinct()]
    return HttpResponse(
        json.dumps({
            'success': True,
            'rows': fields,
            'total': len(fields)
        }), content_type="application/json")


@forward_exception_to_http
def get_samples(request):
    sort_property = 'id'
    sort_dir = 'ASC'
    if 'sort' in request.POST:
        sort = json.loads(request.POST.get('sort', '[{}]'))[0]
        sort_property = sort.get('property', 'id')
        sort_dir = sort.get('direction', 'ASC')
        if sort_property == 'username':
            sort_property = 'user__username'
        elif sort_property == 'water_body':
            sort_property = 'station__drainage_basin__type'
        elif sort_property == 'water_body_name':
            sort_property = 'station__drainage_basin__name'
        elif sort_property == 'station':
            sort_property = 'station__name'
        elif sort_property == 'sampling_depth':
            sort_property = 'sampling_depth_min'
        elif sort_property == 'depth_type':
            sort_property = 'depth_type__name'
    rs = Sample.objects.order_by('id').all()
    page = request.POST.get('page', 1)
    start = request.POST.get('start', 0)
    limit = request.POST.get('limit', rs.count())
    filter = request.POST.get('filter', '')
    try:
        filter = json.loads(filter)
    except JSONDecodeError as e:
        pass
    st = int(start)
    en = st + int(limit)
    if filter:
        if type(filter) == str:
            rs = rs.filter(
                Q(sample_code__icontains=filter) |
                Q(user__username__icontains=filter) |
                Q(user__eawuser__institute_short__icontains=filter) |
                Q(station__drainage_basin__type__icontains=filter) |
                Q(station__drainage_basin__name__icontains=filter) |
                Q(station__name__icontains=filter) |
                Q(depth_type__name__icontains=filter)
            )
        elif type(filter) == dict and len(filter['advanced']) > 0:
            rs_filter = Q()
            for f in filter['advanced'][::-1]:
                _d = {f['field_name'] + '__icontains': f['field_value']}
                conn = Q.AND
                if f['field_and_or'] == 'or':
                    conn = Q.OR
                if f['field_contains'] == 'contains':
                    rs_filter.add(Q(**_d), conn)
                elif f['field_contains'] == 'doesnt_contain':
                    rs_filter.add(~Q(**_d), conn)
                elif f['field_contains'] == 'gt':
                    _d = {f['field_name'] + '__gt': f['field_value']}
                    rs_filter.add(Q(**_d), conn)
                elif f['field_contains'] == 'gte':
                    _d = {f['field_name'] + '__gte': f['field_value']}
                    rs_filter.add(Q(**_d), conn)
                elif f['field_contains'] == 'lt':
                    _d = {f['field_name'] + '__lt': f['field_value']}
                    rs_filter.add(Q(**_d), conn)
                elif f['field_contains'] == 'lte':
                    _d = {f['field_name'] + '__lte': f['field_value']}
                    rs_filter.add(Q(**_d), conn)
            rs = rs.filter(rs_filter)

    order = ''
    if sort_dir == 'DESC':
        order = '-'
    rs = rs.order_by(order + sort_property)
    #if sort_property == 'latitude':
    #    rs = rs.annotate(cc=Min('geographicalpoint__latitude')).order_by(order + 'cc')
    #if sort_property == 'longitude':
    #    rs = rs.annotate(cc=Min('geographicalpoint__longitude')).order_by(order + 'cc')

    rows = []
    for s in rs[st:en]:
        v = s.to_dict()
        v['username'] = s.user.username + " ({institute})".format(institute=s.user.eawuser.institute_short)
        v['can_edit'] = request.user.is_superuser or s.user == request.user
        v['tracking_comments'] = [{'commenter': c.user.username + " ({institute})".format(institute=c.user.eawuser.institute_short),
                                   'date': c.date.strftime('%m-%d-%Y') if c.date else None,
                                   'comment': c.comment
                                   } for c in s.trackingcomment_set.all()]
        rows.append(v)
    total = rs.count()
    return HttpResponse(
            json.dumps({
                'success': True,
                'rows': rows,
                'total': total
            }), content_type="application/json")


@send_email_to_admin('update_sample')
@forward_exception_to_http
def update_sample(request):
    sample = Sample.objects.get(id=request.POST.get('id', None))
    sample.laboratory_ph = request.POST.get('laboratory_ph', None) or None
    sample.laboratory_conductivity = request.POST.get('laboratory_conductivity', None) or None
    sample.total_alkalinity = request.POST.get('total_alkalinity', None) or None
    sample.bicarbonates = request.POST.get('bicarbonates', None) or None
    sample.nitrate_nitrogen = request.POST.get('nitrate_nitrogen', None) or None
    sample.sulphates = request.POST.get('sulphates', None) or None
    sample.chloride = request.POST.get('chloride', None) or None
    sample.calcium = request.POST.get('calcium', None) or None
    sample.magnesium = request.POST.get('magnesium', None) or None
    sample.sodium = request.POST.get('sodium', None) or None
    sample.potassium = request.POST.get('potassium', None) or None
    sample.ammonium = request.POST.get('ammonium', None) or None
    sample.total_nitrogen = request.POST.get('total_nitrogen', None) or None
    sample.soluble_reactive_phosphorus = request.POST.get('soluble_reactive_phosphorus', None) or None
    sample.total_phosphorus = request.POST.get('total_phosphorus', None) or None
    sample.reactive_silica = request.POST.get('reactive_silica', None) or None
    sample.dry_weight = request.POST.get('dry_weight', None) or None
    sample.chlorophyll_a = request.POST.get('chlorophyll_a', None) or None
    sample.dna_extraction_kit_id = request.POST.get('dna_extraction_kit', None) or None
    sample.dna_extraction_date = request.POST.get('dna_extraction_date', None) or None
    sample.dna_quantity = request.POST.get('dna_quantity', None) or None
    sample.dna_quantification_method_id = request.POST.get('dna_quantification_method', None) or None
    sample.dna_quality_a260_280 = request.POST.get('dna_quality_a260_280', None) or None
    sample.dna_quality_a260_230 = request.POST.get('dna_quality_a260_230', None) or None

    if sample.dna_extraction_date:
        dt = datetime.datetime.strptime(sample.dna_extraction_date, '%m/%d/%Y')
        sample.dna_extraction_date = datetime.datetime(dt.year, dt.month, dt.day, tzinfo=pytz.UTC)

    full_dir = os.path.join('/tmp/', sample.sample_code)
    files = ['vertical_temperature_profiles',
             'phytoplankton_countings',
             'cyanotoxin_samples']
    for f in files:
        full_path = os.path.join(full_dir, f + '.xlsx')
        if os.path.exists(full_path):
            with open(full_path, 'rb') as fi:
                setattr(sample, f, fi.read())
            os.remove(full_path)
    sample.save()
    for k, v in request.POST.items():
        if k.endswith('_comment') and v:
            field_name = k.replace('_comment', '')
            value = v
            comment = Comment.objects.filter(Q(sample=sample) & Q(field_name=field_name)).first()
            if not comment:
                comment = Comment(
                    sample=sample,
                    field_name=field_name
                )
            comment.comment = value
            comment.save()
    barcode_buffer = __create_barcode_file([sample.id])
    excel_buffer = __create_env_metadata([sample.id])
    send_email(request.user.email,
               'Eco-AlpsWater sample updated: ' + sample.sample_code,
               '''
       Dear {user},
       sample with code {sample_code} has just been succesfully updated to the Eco-AlpsWater database.
       Please find attached to this e-mail a PNG file with the sample barcode and an Excel file with all the sample information.
       Both files are ZIP-compressed.
       
       This e-mail has been automatically sent from the Eco-AlpsWater website.
               '''.format(user=request.user.username, sample_code=sample.sample_code),
               [(sample.sample_code + '_barcode.zip', barcode_buffer.getvalue(), 'application/zip'),
                (sample.sample_code + '_sample.zip', excel_buffer.getvalue(), 'application/zip')]
               )
    return HttpResponse(
        json.dumps({
            'success': True
        }), content_type="application/json")


@forward_exception_to_http
def get_samples_complete(request):
    id = request.POST.get('id', None)
    description = bool(request.POST.get('description', False))
    if id:
        rs = Sample.objects.filter(id=id)
    else:
        rs = Sample.objects.order_by('id')
    if not request.user.is_superuser:
        rs = rs.filter(user=request.user)
    if description:
        rows = [s.to_dict_description(dna_extraction_kit='dna_extraction_kit_id', dna_quantification_method='dna_quantification_method_id') for s in rs]
    else:
        rows = [s.to_dict_complete() for s in rs]
    rows.append(dict(Comment.objects.filter(sample_id=id).values_list('field_name', 'comment')))
    total = rs.count()
    return HttpResponse(
            json.dumps({
                'success': True,
                'rows': rows,
                'total': total
            }), content_type="application/json")


def __create_env_metadata(samples):
    buffer = io.BytesIO()
    zf = zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED)
    files = []
    for sample_id in samples:
        sample = Sample.objects.get(id=sample_id)
        workbook = xlsxwriter.Workbook(sample.sample_code + '.xlsx')
        worksheet = workbook.add_worksheet()
        row = 0
        col = 0
        bold = workbook.add_format({'bold': True})
        s = sample.to_dict_description()
        for i, h in enumerate(['Field', 'Field Description', 'Field Value', 'Comments']):
            worksheet.write(row, col + i, h, bold)
        row += 1
        for field in s.keys():
            desc = FieldDescription.objects.filter(field_name=field)
            if len(desc) == 1:
                desc = desc[0].description
            if not desc:
                desc = ''
            value = s[field]
            if not value:
                value = ''
            comments = Comment.objects.filter(sample=sample, field_name=field)
            if len(comments) == 1:
                comments = comments[0].comment.strip()
            if not comments:
                comments = ''
            worksheet.write(row, col, field)
            worksheet.write(row, col + 1, desc)
            worksheet.write(row, col + 2, value)
            worksheet.write(row, col + 3, comments)
            row += 1
        workbook.close()
        zf.write(sample.sample_code + '.xlsx')
        if sample.vertical_temperature_profiles:
            with tempfile.NamedTemporaryFile(prefix='vertical_temperature_profiles', suffix='.xlsx', mode='wb+') as f:
                f.write(sample.vertical_temperature_profiles)
                zf.write(f.name)
        if sample.phytoplankton_countings:
            with tempfile.NamedTemporaryFile(prefix='phytoplankton_countings', suffix='.xlsx', mode='wb+') as f:
                f.write(sample.phytoplankton_countings)
                zf.write(f.name)
        if sample.cyanotoxin_samples:
            with tempfile.NamedTemporaryFile(prefix='cyanotoxin_samples', suffix='.xlsx', mode='wb+') as f:
                f.write(sample.cyanotoxin_samples)
                zf.write(f.name)
        files.append(sample.sample_code + '.xlsx')
    zf.close()
    for f in files:
        os.remove(f)
    return buffer


@send_email_to_admin('get_env_metadata')
@forward_exception_to_http
def get_env_metadata(request):
    samples = json.loads(request.POST['samples'])
    buffer = __create_env_metadata(samples)
    response = HttpResponse(buffer.getvalue())
    response['Content-Type'] = 'application/x-zip-compressed'
    response['Content-Disposition'] = 'attachment; filename=samples.zip'
    return response


def __create_barcode_file(sample_ids):
    buffer = io.BytesIO()
    zf = zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED)
    files = []
    for sample_id in sample_ids:
        s = Sample.objects.get(id=sample_id)
        code128 = barcode.get_barcode_class('code128')
        bcode = code128(s.sample_id, writer=ImageWriter())
        bcode.save(s.sample_code)
        zf.write(s.sample_code + '.png')
        files.append(s.sample_code + '.png')
    zf.close()
    for f in files:
        os.remove(f)
    return buffer


@send_email_to_admin('get_barcode')
@forward_exception_to_http
def get_barcode(request):
    buffer = __create_barcode_file(json.loads(request.POST['samples']))
    response = HttpResponse(buffer.getvalue())
    response['Content-Type'] = 'application/x-zip-compressed'
    response['Content-Disposition'] = 'attachment; filename=samples.zip'
    return response


@send_email_to_admin('save_station')
@forward_exception_to_http
def save_station(request):
    values = json.loads(request.POST['values'])
    station = Station(
        name=values['station'],
        type=values['station_type'],
        pp_code=values['station'],
        drainage_basin_id=values['water_body_name']
    )
    station.save()
    if type(values['latitude']) == list:
        for lat, lon in zip(values['latitude'], values['longitude']):
            geo_point = GeographicalPoint(
                station=station,
                latitude=lat,
                longitude=lon
            )
            geo_point.save()
    else:
        geo_point = GeographicalPoint(
            station=station,
            latitude=values['latitude'],
            longitude=values['longitude']
        )
        geo_point.save()

    return HttpResponse(
        json.dumps({
            'success': True
        }), content_type="application/json")


@send_email_to_admin('save_sample')
@forward_exception_to_http
def save_sample(request):
    sample = Sample(
        user=request.user,
        sample_id=request.POST.get('sample_id', None) or None,
        sample_code=request.POST.get('sample_code', None) or None,
        cap_code=request.POST.get('cap_code', None) or None,
        station_id=request.POST.get('station', None) or None,
        sampling_date=request.POST.get('sampling_date', None) or None,
        sampling_depth_min=request.POST.get('sampling_depth_min', None) or None,
        sampling_depth_max=request.POST.get('sampling_depth_max', None) or None,
        sampling_volume=request.POST.get('sampling_volume', None) or None,
        depth_type_id=request.POST.get('depth_type', None) or None,
        edna_marker_id=request.POST.get('edna_marker', None) or None,
        biological_element_id=request.POST.get('biological_element', None) or None,
        sampling_matrix_id=request.POST.get('sampling_matrix', None) or None,
        sampling_strategy_id=request.POST.get('sampling_strategy', None) or None,
        mean_river_outflow=request.POST.get('mean_river_outflow', None) or None,
        mixing_type_id=request.POST.get('mixing_type', None) or None,
        catchment_area=request.POST.get('catchment_area', None) or None,
        temperature=request.POST.get('temperature', None) or None,
        field_ph=request.POST.get('field_ph', None) or None,
        field_conductivity=request.POST.get('field_conductivity', None) or None,
        light_attenuation_coefficient=request.POST.get('light_attenuation_coefficient', None) or None,
        secchi_disk_depth=request.POST.get('secchi_disk_depth', None) or None,
        euphotic_layer=request.POST.get('euphotic_layer', None) or None,
        oxygen_concentration=request.POST.get('oxygen_concentration', None) or None,
        oxygen_percentage=request.POST.get('oxygen_percentage', None) or None,
        laboratory_ph=request.POST.get('laboratory_ph', None) or None,
        laboratory_conductivity=request.POST.get('laboratory_conductivity', None) or None,
        total_alkalinity=request.POST.get('total_alkalinity', None) or None,
        bicarbonates=request.POST.get('bicarbonates', None) or None,
        nitrate_nitrogen=request.POST.get('nitrate_nitrogen', None) or None,
        sulphates=request.POST.get('sulphates', None) or None,
        chloride=request.POST.get('chloride', None) or None,
        calcium=request.POST.get('calcium', None) or None,
        magnesium=request.POST.get('magnesium', None) or None,
        sodium=request.POST.get('sodium', None) or None,
        potassium=request.POST.get('potassium', None) or None,
        ammonium=request.POST.get('ammonium', None) or None,
        total_nitrogen=request.POST.get('total_nitrogen', None) or None,
        soluble_reactive_phosphorus=request.POST.get('soluble_reactive_phosphorus', None) or None,
        total_phosphorus=request.POST.get('total_phosphorus', None) or None,
        reactive_silica=request.POST.get('reactive_silica', None) or None,
        dry_weight=request.POST.get('dry_weight', None) or None,
        chlorophyll_a=request.POST.get('chlorophyll_a', None) or None,
        dna_extraction_kit_id=request.POST.get('dna_extraction_kit', None) or None,
        dna_extraction_date=request.POST.get('dna_extraction_date', None) or None,
        dna_quantity=request.POST.get('dna_quantity', None) or None,
        dna_quantification_method_id=request.POST.get('dna_quantification_method', None) or None,
        dna_quality_a260_280=request.POST.get('dna_quality_a260_280', None) or None,
        dna_quality_a260_230=request.POST.get('dna_quality_a260_230', None) or None
    )

    if sample.sampling_date:
        dt = datetime.datetime.strptime(sample.sampling_date, '%m/%d/%Y')
        sample.sampling_date = datetime.datetime(dt.year, dt.month, dt.day, tzinfo=pytz.UTC)

    if sample.dna_extraction_date:
        dt = datetime.datetime.strptime(sample.dna_extraction_date, '%m/%d/%Y')
        sample.dna_extraction_date = datetime.datetime(dt.year, dt.month, dt.day, tzinfo=pytz.UTC)

    full_dir = os.path.join('/tmp/', sample.sample_code)
    files = ['vertical_temperature_profiles',
             'phytoplankton_countings',
             'cyanotoxin_samples']
    for f in files:
        full_path = os.path.join(full_dir, f + '.xlsx')
        if os.path.exists(full_path):
            with open(full_path, 'rb') as fi:
                setattr(sample, f, fi.read())
            os.remove(full_path)
    sample.save()

    for k, v in request.POST.items():
        if k.endswith('_comment') and v:
            field_name = k.replace('_comment', '')
            value = v
            comment = Comment(
                sample=sample,
                field_name=field_name,
                comment=value
            )
            comment.save()
    barcode_buffer = __create_barcode_file([sample.id])
    excel_buffer = __create_env_metadata([sample.id])
    send_email(request.user.email,
        'Eco-AlpsWater new sample added: ' + sample.sample_code,
        '''
Dear {user},
a new sample with code {sample_code} has just been succesfully added to the Eco-AlpsWater database.
Please find attached to this e-mail a PNG file with the sample barcode and an Excel file with all the sample information.
Both files are ZIP-compressed.
                                                         
This e-mail has been automatically sent from the Eco-AlpsWater website.
        '''.format(user=request.user.username, sample_code=sample.sample_code),
        [(sample.sample_code + '_barcode.zip', barcode_buffer.getvalue(), 'application/zip'),
         (sample.sample_code + '_sample.zip', excel_buffer.getvalue(), 'application/zip')]
    )
    return HttpResponse(
            json.dumps({
                'success': True
            }), content_type="application/json")


