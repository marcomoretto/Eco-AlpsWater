from django.db import models


class PhytoplanktonCountings(models.Model):
    name = models.TextField(blank=False, null=False)
