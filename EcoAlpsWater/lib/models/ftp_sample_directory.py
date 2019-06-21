from django.db import models

from EcoAlpsWater.lib.models.sample import Sample


class FTPSampleDirectory(models.Model):
    base_dirname = models.TextField(blank=False, null=False, unique=True)
    full_dirname = models.TextField(blank=False, null=False, unique=True)
    sample = models.ForeignKey(Sample, on_delete=models.CASCADE, null=False, default=1)
