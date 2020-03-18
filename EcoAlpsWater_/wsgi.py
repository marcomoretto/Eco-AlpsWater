"""
WSGI config for EcoAlpsWater_ project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/howto/deployment/wsgi/
"""

import os
import subprocess

from crontab import CronTab
from django.core.wsgi import get_wsgi_application

# start crontab
my_cron = CronTab(user='root')
my_cron.remove_all()
my_cron.write()
job = my_cron.new(command='rm -rf ' + os.environ['EAW_DOWNLOAD_DIRECTORY'] + '*', comment='delete_download')

job.hour.on(0)
my_cron.write()
subprocess.run(['cron'])

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcoAlpsWater_.settings')

application = get_wsgi_application()
