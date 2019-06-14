import os
import zipfile
import io
from json import JSONDecodeError

from PIL import Image
import datetime
import json

from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from EcoAlpsWater.lib.decorator import forward_exception_to_http
from EcoAlpsWater.lib.models.biological_element import BiologicalElement
from EcoAlpsWater.lib.models.comment import Comment
from EcoAlpsWater.lib.models.cyanotoxin_samples import CyanotoxinSamples
from EcoAlpsWater.lib.models.depth_type import DepthType
from EcoAlpsWater.lib.models.dna_extraction_kit import DNAExtractionKit
from EcoAlpsWater.lib.models.drainage_basin import DrainageBasin
from EcoAlpsWater.lib.models.edna_marker import EDNAMarker
from EcoAlpsWater.lib.models.field_description import FieldDescription
from EcoAlpsWater.lib.models.mixing_type import MixingType
from EcoAlpsWater.lib.models.phytoplankton_countings import PhytoplanktonCountings
from EcoAlpsWater.lib.models.sample import Sample
from EcoAlpsWater.lib.models.vertical_temperature_profile import VerticalTemperatureProfile
from EcoAlpsWater.lib.sample_coder import SampleCoder

import barcode
from barcode.writer import ImageWriter
import xlsxwriter


def index(request):
    return render(request, 'EcoAlpsWater/index.html', None)


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
            }), content_type="application/json")
    else:
        return HttpResponse(
            json.dumps({
                'login': False
            }), content_type="application/json")


def get_combo_field_values(request):
    water_bodies = []
    for ty in DrainageBasin.TYPE:
        water_body = {'id': ty[0], 'name': ty[0], 'water_body_name': []}
        for db in DrainageBasin.objects.filter(type=ty[0]):
            wb = db.to_dict()
            wb['station'] = [ss.to_dict() for ss in db.station_set.all()]
            water_body['water_body_name'].append(wb)
        water_bodies.append(water_body)
    depth_type = [dt.to_dict() for dt in DepthType.objects.all()]
    edna_marker = [em.to_dict() for em in EDNAMarker.objects.all()]
    bio_element = [be.to_dict() for be in BiologicalElement.objects.all()]
    mixing_type = [m.to_dict() for m in MixingType.objects.all()]
    dna_extraction_kit = [ek.to_dict() for ek in DNAExtractionKit.objects.all()]
    vertical_temperature_profiles = [vt.to_dict() for vt in VerticalTemperatureProfile.objects.all()]
    phytoplankton_countings = [pc.to_dict() for pc in PhytoplanktonCountings.objects.all()]
    cyanotoxin_samples = [cs.to_dict() for cs in CyanotoxinSamples.objects.all()]
    values = {
        'water_body': water_bodies,
        'depth_type': depth_type,
        'edna_marker': edna_marker,
        'biological_element': bio_element,
        'mixing_type': mixing_type,
        'dna_extraction_kit': dna_extraction_kit,
        'vertical_temperature_profiles': vertical_temperature_profiles,
        'phytoplankton_countings': phytoplankton_countings,
        'cyanotoxin_samples': cyanotoxin_samples
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
                    'institute': request.user.eawuser.institute,
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
    water_body = request.POST.get('water_body', None) or None,
    water_body_name = request.POST.get('water_body_name', None) or None
    depth = request.POST.get('sampling_depth', '') or ''
    depth_type = request.POST.get('depth_type', None) or None
    sampling_date = request.POST.get('sampling_date', None) or None,

    sample_code = SampleCoder(
        biological_element[0],
        water_body,
        water_body_name,
        depth,
        depth_type,
        sampling_date
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
        'id': 'drainage_basin__type',
        'name': 'Water body type'
    }, {
        'id': 'drainage_basin__name',
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
        'id': 'sampling_depth',
        'name': 'Sampling depth'
    }, {
        'id': '',
        'name': ''
    }, {
        'id': '',
        'name': ''
    }, {
        'id': '',
        'name': ''
    }, {
        'id': '',
        'name': ''
    }, {
        'id': '',
        'name': ''
    }, {
        'id': 'biological_element__name',
        'name': 'Biological element'
    }]
    '''
    sampling_date = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    sampling_depth = models.FloatField(null=False, blank=False)
    depth_type = models.ForeignKey(DepthType, on_delete=models.CASCADE, null=False, default=1)
    edna_marker = models.ForeignKey(EDNAMarker, on_delete=models.CASCADE, null=False, default=1)
    biological_element = models.ForeignKey(BiologicalElement, on_delete=models.CASCADE, null=False, default=1)
    mean_river_outflow = models.FloatField(null=True, blank=True)
    mixing_type = models.ForeignKey(MixingType, on_delete=models.CASCADE, null=True, blank=True)
    catchment_area = models.FloatField(null=True, blank=True)
    sampling_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    sampling_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    temperature = models.FloatField(null=True, blank=True)
    field_ph = models.FloatField(null=True, blank=True)
    conductivity_ph = models.FloatField(null=True, blank=True)
    light_attenuation_coefficient = models.FloatField(null=True, blank=True)
    secchi_disk_depth = models.FloatField(null=True, blank=True)
    euphotic_layer = models.FloatField(null=True, blank=True)
    oxygen_concentration = models.FloatField(null=True, blank=True)
    oxygen_percentage = models.FloatField(null=True, blank=True)
    laboratory_ph = models.FloatField(null=True, blank=True)
    laboratory_conductivity = models.FloatField(null=True, blank=True)
    total_alkalinity = models.FloatField(null=True, blank=True)
    bicarbonates = models.FloatField(null=True, blank=True)
    nitrate_nitrogen = models.FloatField(null=True, blank=True)
    sulphates = models.FloatField(null=True, blank=True)
    chloride = models.FloatField(null=True, blank=True)
    calcium = models.FloatField(null=True, blank=True)
    magnesium = models.FloatField(null=True, blank=True)
    sodium = models.FloatField(null=True, blank=True)
    potassium = models.FloatField(null=True, blank=True)
    ammonium = models.FloatField(null=True, blank=True)
    total_nitrogen = models.FloatField(null=True, blank=True)
    soluble_reactive_phosphorus = models.FloatField(null=True, blank=True)
    total_phosphorus = models.FloatField(null=True, blank=True)
    reactive_silica = models.FloatField(null=True, blank=True)
    dry_weight = models.FloatField(null=True, blank=True)
    chlorophyll_a = models.FloatField(null=True, blank=True)
    dna_extraction_kit = models.ForeignKey(DNAExtractionKit, on_delete=models.CASCADE, null=True, blank=True)
    dna_extraction_date = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    vertical_temperature_profiles = models.ForeignKey(VerticalTemperatureProfile, on_delete=models.CASCADE, null=True, blank=True)
    phytoplankton_countings = models.ForeignKey(PhytoplanktonCountings, on_delete=models.CASCADE, null=True, blank=True)
    cyanotoxin_samples = models.ForeignKey(CyanotoxinSamples, on_delete=models.CASCADE, null=True, blank=True)'''
    return HttpResponse(
            json.dumps({
                'success': True,
                'rows': fields,
                'total': len(fields)
            }), content_type="application/json")

@forward_exception_to_http
def get_samples(request):
    rs = Sample.objects.order_by('id')
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
                Q(biological_element__name__icontains=filter) |
                Q(drainage_basin__type__icontains=filter) |
                Q(drainage_basin__name__icontains=filter) |
                Q(station__name__icontains=filter) |
                Q(depth_type__name__icontains=filter) |
                Q(edna_marker__name__icontains=filter)
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
    rows = [s.to_dict() for s in rs[st:en]]
    total = rs.count()
    return HttpResponse(
            json.dumps({
                'success': True,
                'rows': rows,
                'total': total
            }), content_type="application/json")

@forward_exception_to_http
def get_samples_complete(request):
    id = request.POST.get('id', None)
    description = bool(request.POST.get('description', False))
    if id:
        rs = Sample.objects.filter(id=id)
    else:
        rs = Sample.objects.order_by('id')
    if description:
        rows = [s.to_dict_description() for s in rs]
    else:
        rows = [s.to_dict_complete() for s in rs]
    total = rs.count()
    return HttpResponse(
            json.dumps({
                'success': True,
                'rows': rows,
                'total': total
            }), content_type="application/json")

@forward_exception_to_http
def get_env_metadata(request):
    samples = json.loads(request.POST['samples'])
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
                comments = comments[0].comment
            if not comments:
                comments = ''
            worksheet.write(row, col, field)
            worksheet.write(row, col + 1, desc)
            worksheet.write(row, col + 2, value)
            worksheet.write(row, col + 3, comments)
            row += 1
        workbook.close()
        zf.write(sample.sample_code + '.xlsx')
        files.append(sample.sample_code + '.xlsx')
    zf.close()
    for f in files:
        os.remove(f)
    response = HttpResponse(buffer.getvalue())
    response['Content-Type'] = 'application/x-zip-compressed'
    response['Content-Disposition'] = 'attachment; filename=samples.zip'
    return response

@forward_exception_to_http
def get_barcode(request):
    samples = json.loads(request.POST['samples'])
    buffer = io.BytesIO()
    zf = zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED)
    files = []
    for sample_id in samples:
        s = Sample.objects.get(id=sample_id)
        ean = barcode.get_barcode_class('ean13')
        bcode = ean(s.sample_id, writer=ImageWriter())
        bcode.save(s.sample_code)
        zf.write(s.sample_code + '.png')
        files.append(s.sample_code + '.png')
    zf.close()
    for f in files:
        os.remove(f)
    response = HttpResponse(buffer.getvalue())
    response['Content-Type'] = 'application/x-zip-compressed'
    response['Content-Disposition'] = 'attachment; filename=samples.zip'
    return response

@forward_exception_to_http
def save_sample(request):
    sample = Sample(
        user=request.user,
        sample_id=request.POST.get('sample_id', None) or None,
        sample_code=request.POST.get('sample_code', None) or None,
        drainage_basin_id=request.POST.get('water_body_name', None) or None,
        cap_code=request.POST.get('cap_code', None) or None,
        station_id=request.POST.get('station', None) or None,
        sampling_date=request.POST.get('sampling_date', None) or None,
        sampling_depth=request.POST.get('sampling_depth', None) or None,
        depth_type_id=request.POST.get('depth_type', None) or None,
        edna_marker_id=request.POST.get('edna_marker', None) or None,
        biological_element_id=request.POST.get('biological_element', None) or None,
        mean_river_outflow=request.POST.get('mean_river_outflow', None) or None,
        mixing_type_id=request.POST.get('mixing_type', None) or None,
        catchment_area=request.POST.get('catchment_area', None) or None,
        sampling_latitude=request.POST.get('sampling_latitude', None) or None,
        sampling_longitude=request.POST.get('sampling_longitude', None) or None,
        temperature=request.POST.get('temperature', None) or None,
        field_ph=request.POST.get('field_ph', None) or None,
        conductivity_ph=request.POST.get('conductivity_ph', None) or None,
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
        vertical_temperature_profiles_id=request.POST.get('vertical_temperature_profiles', None) or None,
        phytoplankton_countings_id=request.POST.get('phytoplankton_countings', None) or None,
        cyanotoxin_samples_id=request.POST.get('cyanotoxin_samples', None) or None,
    )
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
    return HttpResponse(
            json.dumps({
                'success': True
            }), content_type="application/json")


