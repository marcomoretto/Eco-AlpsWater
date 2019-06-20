import os
from stat import S_IREAD, S_IRGRP, S_IROTH

from pyftpdlib.filesystems import AbstractedFS
from pyftpdlib.handlers import FTPHandler, PassiveDTP, DTPHandler
import logging
from django.conf import settings

PassiveDTP.timeout = 200



def file_invalid(filename, mode):
    invalid = False
    if mode == 'wb':
        invalid = ('sencha' in filename) or (os.path.isfile(filename) and os.path.exists(filename))
    return invalid


class EcoAlpsWaterFilesystem(AbstractedFS):

    def open(self, filename, mode):
        self.cmd_channel.server._ignored_files = None
        if file_invalid(filename, mode):
            self.cmd_channel.server._ignored_files = (self.cmd_channel.username, filename)
            return open('/dev/null', mode)
        return AbstractedFS.open(self, filename, mode)

    def chdir(self, path):
        if settings.FTP_SERVER_VAULT_DIRECTORY not in path:
            AbstractedFS.chdir(self, path)


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

    def on_file_received(self, file):
        # do something when a file has been received
        if file != '/dev/null':
            dest_file = os.path.join(settings.FTP_SERVER_VAULT_DIRECTORY, os.path.basename(file))
            os.rename(file, dest_file)
            os.chmod(dest_file, S_IREAD|S_IRGRP|S_IROTH)

    def on_incomplete_file_sent(self, file):
        # do something when a file is partially sent
        pass

    def on_incomplete_file_received(self, file):
        # remove partially uploaded files
        import os
        os.remove(file)
