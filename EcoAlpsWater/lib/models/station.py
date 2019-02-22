from django.db import models


class Station(models.Model):
    name = models.TextField(blank=False, null=False)
    pp_code = models.TextField(blank=True, null=True)
