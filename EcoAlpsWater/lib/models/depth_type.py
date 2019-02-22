from django.db import models


class DepthType(models.Model):
    name = models.TextField(blank=False, null=False)

