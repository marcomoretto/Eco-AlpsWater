import json

from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from EcoAlpsWater.decorator import forward_exception_to_http


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


def get_field_descriptions(request):
    descriptions = [{
        'item_id': 'edna_marker',
        'description': 'Ciao ciao ciao!!!'
    }]
    return HttpResponse(
            json.dumps({
                'descriptions': descriptions
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
