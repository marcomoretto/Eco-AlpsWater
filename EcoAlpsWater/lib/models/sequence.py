from django.db import models

from EcoAlpsWater.lib.models.sample import Sample


class Sequence(models.Model):
    sample = models.ForeignKey(Sample, on_delete=models.CASCADE, null=False, default=1)
    filename = models.TextField(blank=False, null=False)
    md5sum = models.TextField(blank=False, null=False)
    upload_date = models.DateTimeField(auto_now_add=True, blank=False, null=False)

