from django.conf.urls import url
from django.views.generic import TemplateView

from EcoAlpsWater import views

from django.conf import settings

template_name = "EcoAlpsWater/index.html"
#if settings.DEBUG:
#    template_name = "EcoAlpsWater/dev_index.html"

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name=template_name)),
    url(r'^check_login/$', views.check_login, name='check_login'),
    url(r'^logout/$', views.request_logout, name='request_logout'),
    url(r'^get_field_descriptions/$', views.get_field_descriptions, name='get_field_descriptions'),
    url(r'^get_combo_field_values/$', views.get_combo_field_values, name='get_combo_field_values'),
    url(r'^get_user_info/$', views.get_user_info, name='get_user_info'),
    url(r'^change_password/$', views.change_password, name='change_password'),
    url(r'^save_sample/$', views.save_sample, name='save_sample'),
    url(r'^update_ids/$', views.update_ids, name='update_ids'),
    url(r'^get_samples/$', views.get_samples, name='get_samples'),
    url(r'^get_samples_complete/$', views.get_samples_complete, name='get_samples_complete'),
    url(r'^get_barcode/$', views.get_barcode, name='get_barcode'),
    url(r'^get_env_metadata/$', views.get_env_metadata, name='get_env_metadata'),
    url(r'^get_search_field_names/$', views.get_search_field_name, name='get_search_field_names'),
    url(r'^send_email/$', views.send_email, name='send_email'),
]