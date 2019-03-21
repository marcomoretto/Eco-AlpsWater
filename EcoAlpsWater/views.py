import datetime
import json

from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from EcoAlpsWater.lib.decorator import forward_exception_to_http
from EcoAlpsWater.lib.models.biological_element import BiologicalElement
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
def get_samples(request):
    page = request.POST['page']
    start = request.POST['start']
    limit = request.POST['limit']
    filter = request.POST.get('filter', None)
    st = int(start)
    en = st + int(limit)
    rs = Sample.objects.order_by('id')
    if filter:
        rs = rs.filter(
            Q(drainage_basin__type__icontains=filter) |
            Q(drainage_basin__name__icontains=filter) |
            Q(station__name__icontains=filter) |
            Q(depth_type__name__icontains=filter) |
            Q(edna_marker__name__icontains=filter)
        )
    rows = [s.to_dict() for s in rs[st:en]]
    total = Sample.objects.count()
    return HttpResponse(
            json.dumps({
                'success': True,
                'rows': rows,
                'total': total
            }), content_type="application/json")

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
    return HttpResponse(
            json.dumps({
                'success': True
            }), content_type="application/json")
