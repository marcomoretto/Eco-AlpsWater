import os

from django.contrib.auth.models import User
from django.http import HttpResponse
import json

from EcoAlpsWater.lib.email import send_email
from functools import partial, wraps

from EcoAlpsWater.lib.models.sample import Sample


class send_email_to_admin(object):

    def __init__(self, operation):
        self.operation = operation

    def __call__(self, f):
        def wrapped_f(*args):
            request = args[0]
            title = 'Eco-AlpsWater admin notification'
            message = ''
            if self.operation == 'update_sample':
                user = request.user.username
                sample = Sample.objects.get(id=request.POST.get('id', None))
                message = '''
                Dear admin,
                user {user} has just performed an update operation on sample {sample_code}.
                '''.format(user=user, sample_code=sample.sample_code)
            elif self.operation == 'save_sample':
                user = request.user.username
                sample_code = request.POST.get('sample_code', None)
                message = '''
                Dear admin,
                user {user} has just performed a create new sample operation with code {sample_code}.
                '''.format(user=user, sample_code=sample_code)
            elif self.operation == 'get_sequence':
                user = request.user.username
                samples = json.loads(request.POST['samples'])
                message = '''
                Dear admin,
                user {user} has just request to download sequence files for samples {samples}.
                '''.format(user=user, samples=', '.join([Sample.objects.get(id=sample_id).sample_code for sample_id in samples]))
            elif self.operation == 'get_env_metadata':
                user = request.user.username
                samples = json.loads(request.POST['samples'])
                message = '''
                Dear admin,
                user {user} has just request to download environmental metadata for samples {samples}.
                '''.format(user=user, samples=', '.join([Sample.objects.get(id=sample_id).sample_code for sample_id in samples]))
            elif self.operation == 'get_barcode':
                user = request.user.username
                samples = json.loads(request.POST['samples'])
                message = '''
                Dear admin,
                user {user} has just request to download barcode for samples {samples}.
                '''.format(user=user, samples=', '.join([Sample.objects.get(id=sample_id).sample_code for sample_id in samples]))
            elif self.operation == 'save_station':
                user = request.user.username
                values = json.loads(request.POST['values'])
                message = '''
                Dear admin,
                user {user} has just request to create a new station with name {station}.
                '''.format(user=user, station=values['station'])
            elif self.operation == 'ftp_file_received':
                ftp_obj = request
                user = ftp_obj.username
                file = args[1]
                message = '''
                Dear admin,
                user {user} has just sent a file named {file_name} to the FTP server.
                '''.format(user=user, file_name=os.path.basename(file))
            for admin in User.objects.filter(is_superuser=True):
                try:
                    send_email(admin.email, title, message)
                except Exception as e:
                    pass
            return f(*args)
        return wrapped_f


def forward_exception_to_http(func):
    def func_wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            error_msg = {
                'type': 'error',
                'title': 'Error',
                'message': str(e)
            }
            return HttpResponse(json.dumps(error_msg),
                                content_type="application/json")
    return func_wrapper
