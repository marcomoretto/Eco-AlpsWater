from django.db import models


class VerticalTemperatureProfile(models.Model):
    name = models.TextField(blank=False, null=False)
