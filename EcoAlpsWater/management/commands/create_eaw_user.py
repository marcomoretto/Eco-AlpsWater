import sys

from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.core.management import BaseCommand, CommandError

from EcoAlpsWater.lib.models.eaw_user import EAWUser


class Command(BaseCommand):
    help = "Create EAW user"

    def add_arguments(self, parser):
        parser.add_argument('username', help="The user name", type=str)
        parser.add_argument('password', help="The user password", type=str)
        parser.add_argument('email', help="The user e-mail", type=str)
        parser.add_argument('institute', help="The user institute", type=str)
        parser.add_argument('institute-short', help="The user institute short name", type=str)

    def handle(self, *args, **options):
        sys.stdout.write('Creating demo user {username}\n'.format(username=options['username']))
        user = User()
        user.is_superuser = False
        user.is_staff = True
        user.is_active = True
        user.username = options['username']
        user.email = options['email']
        user.set_password(options['password'])
        user.save()
        user.eawuser.institute = options['institute']
        user.eawuser.institute_short = options['institute-short']
        user.save()

        sys.stdout.write('User account pk={pk}, "{username}" was created.\n'.format(pk=user.id, username=user.username))

    @staticmethod
    def _create_bled_user(user_filename):
        from django.core import management

        with open(user_filename) as f:
            for l in f:
                email = l.strip()
                s = email.split('@')
                username = s[0].lower()

                management.call_command('create_eaw_user',
                                username,
                                username,
                                email,
                                'EAW Bled Meeting',
                                'EAW')

    @staticmethod
    def _test():
        from django.apps import apps
        from django.core import management
        from collections import OrderedDict

        management.call_command('create_eaw_user',
                                'eaw_user_1',
                                'eaw_user_1',
                                'marco.moretto@fmach.it',
                                'Fondazione Edmund Mach',
                                'FEM')