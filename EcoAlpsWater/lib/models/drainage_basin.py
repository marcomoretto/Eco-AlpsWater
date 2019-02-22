from django.db import models


class DrainageBasin(models.Model):
    TYPE = (
        ('Lake', 'LAKE'),
        ('River', 'RIVER')
    )
    name = models.TextField(blank=False, null=False)
    type = models.CharField(max_length=6, choices=TYPE)
