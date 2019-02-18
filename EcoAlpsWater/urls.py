from django.conf.urls import url

from EcoAlpsWater import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^check_login/$', views.check_login, name='check_login'),
    url(r'^logout/$', views.request_logout, name='request_logout'),
    url(r'^get_field_descriptions/$', views.get_field_descriptions, name='get_field_descriptions'),
]