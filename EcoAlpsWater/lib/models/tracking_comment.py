from django.db import models

from EcoAlpsWater.lib.models.sample import Sample
from django.contrib.auth.models import User


class TrackingComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, blank=False, null=False, default=1)
    sample = models.ForeignKey(Sample, on_delete=models.CASCADE, null=False, default=1)
    date = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    comment = models.TextField(blank=False, null=False)

