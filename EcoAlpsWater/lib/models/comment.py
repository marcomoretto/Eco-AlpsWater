from django.db import models

from EcoAlpsWater.lib.models.sample import Sample


class Comment(models.Model):
    sample = models.ForeignKey(Sample, on_delete=models.CASCADE, null=False, default=1)
    field_name = models.TextField(blank=False, null=False)
    comment = models.TextField(blank=False, null=False)

    class Meta:
        unique_together = ('sample', 'field_name',)
