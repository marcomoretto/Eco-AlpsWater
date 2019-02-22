from django.http import HttpResponse
import json


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
