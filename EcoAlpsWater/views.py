import json

from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.


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
