from django.db import models


class MixingType(models.Model):
    name = models.TextField(blank=False, null=False)
