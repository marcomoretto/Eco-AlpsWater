from django.db import models


class CyanotoxinSamples(models.Model):
    name = models.TextField(blank=False, null=False)
