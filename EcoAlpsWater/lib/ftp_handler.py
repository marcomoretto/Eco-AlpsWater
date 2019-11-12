import os
from stat import S_IREAD, S_IRGRP, S_IROTH

from pyftpdlib.filesystems import AbstractedFS
from pyftpdlib.handlers import FTPHandler, PassiveDTP, DTPHandler
import logging
from django.conf import settings

from EcoAlpsWater.lib.decorator import send_email_to_admin
from EcoAlpsWater.lib.email import send_email
from EcoAlpsWater.lib.models.biological_element import BiologicalElement
from EcoAlpsWater.lib.models.edna_marker import EDNAMarker
from EcoAlpsWater.lib.models.ftp_sample_directory import FTPSampleDirectory
from EcoAlpsWater.lib.models.sample import Sample

PassiveDTP.timeout = 200


def file_invalid(filename, mode, user):
    invalid = True
    logging.getLogger('EAW').warning(filename)
    if mode == 'wb':
        full_code = os.path.basename(filename).split('.')[0]
        sample_code_id = full_code.split('_')[0]
        sample_code_be = full_code.split('_')[1]
        sample_code_edna = full_code.split('_')[2]
        sample_exists = Sample.objects.filter(sample_id=sample_code_id).count() > 0
        be_code_valid = BiologicalElement.objects.filter(code__iexact=sample_code_be).count() > 0
        edna_code_valid = EDNAMarker.objects.filter(name__iexact=sample_code_edna).count() > 0
        invalid = not sample_exists or not edna_code_valid or not be_code_valid or \
                  (os.path.isfile(filename) and os.path.exists(filename)) or \
                  os.path.dirname(filename) == settings.FTP_SERVER_DOWNLOAD_DIRECTORY or \
                  os.path.dirname(filename) == settings.FTP_SERVER_VAULT_DIRECTORY
    elif mode == 'rb':
        if filename.startswith(settings.FTP_SERVER_VAULT_DIRECTORY):
            invalid = True
        elif filename.startswith(settings.FTP_SERVER_DOWNLOAD_DIRECTORY):
            basedir = os.path.basename(os.path.dirname(filename))
            users = [s.sample.user for s in FTPSampleDirectory.objects.filter(base_dirname=basedir)]
            invalid = len(set(users)) != 1 or users[0] != user
    return invalid


class EcoAlpsWaterFilesystem(AbstractedFS):

    def open(self, filename, mode):
        self.cmd_channel.server._ignored_files = None
        user = self.cmd_channel.authorizer.get_account(self.cmd_channel.username).user
        if file_invalid(filename, mode, user):
            self.cmd_channel.server._ignored_files = (self.cmd_channel.username, filename)
            return open('/dev/null', mode)
        return super(EcoAlpsWaterFilesystem, self).open(filename, mode)

    def chdir(self, path):
        if settings.FTP_SERVER_VAULT_DIRECTORY not in path:
            super(EcoAlpsWaterFilesystem, self).chdir(path)


class EcoAlpsWaterDTPHandler(DTPHandler):

    def handle_close(self):
        resp_msg = "226 Transfer complete."
        if hasattr(self.cmd_channel.server, '_ignored_files') and self.cmd_channel.server._ignored_files is not None:
            username = self.cmd_channel.server._ignored_files[0]
            filename = os.path.basename(self.cmd_channel.server._ignored_files[1])
            if username == self.cmd_channel.username:
                resp_msg = "226 " + filename + " is an invalid file and won't be saved!"
        logger = logging.getLogger('pyftpdlib')

        if not self._closed:
            if self.receive:
                self.transfer_finished = True
            else:
                self.transfer_finished = len(self.producer_fifo) == 0
            try:
                if self.transfer_finished:
                    self._resp = (resp_msg, logger.debug)
                else:
                    tot_bytes = self.get_transmitted_bytes()
                    self._resp = ("426 Transfer aborted; %d bytes transmitted."
                                  % tot_bytes, logger.debug)
            finally:
                self.close()


class EcoAlpsWaterHandler(FTPHandler):
    def on_connect(self):
        pass

    def on_disconnect(self):
        # do something when client disconnects
        pass

    def on_login(self, username):
        # do something when user login
        pass

    def on_logout(self, username):
        # do something when user logs out
        pass

    def on_file_sent(self, file):
        # do something when a file has been sent
        pass

    @send_email_to_admin('ftp_file_received')
    def on_file_received(self, file):
        # do something when a file has been received
        if file != '/dev/null':
            dest_file = os.path.join(settings.FTP_SERVER_VAULT_DIRECTORY, os.path.basename(file))
            os.rename(file, dest_file)
            os.chmod(dest_file, S_IREAD | S_IRGRP | S_IROTH)
            email = self.authorizer.get_account(self.username).user.email
            username = self.username
            send_email(email,
        'Eco-AlpsWater new sample sequence file added',
        '''
Dear {user},
a new sample sequence file {filename} has just been succesfully uploaded into the Eco-AlpsWater database.
                                                         
This e-mail has been automatically sent from the Eco-AlpsWater website.
        '''.format(user=username, filename=os.path.basename(file))
    )

    def on_incomplete_file_sent(self, file):
        # do something when a file is partially sent
        pass

    def on_incomplete_file_received(self, file):
        # remove partially uploaded files
        import os
        os.remove(file)
