from django.db import models


class EDNAMarker(models.Model):
    name = models.TextField(blank=False, null=False)
