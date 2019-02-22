from django.db import models


class NumericalCodeMapping(models.Model):
    field_name = models.TextField(blank=False, null=False)
    code_position = models.IntegerField(blank=False, null=False)
    num_digits = models.IntegerField(blank=False, null=False)
    num_code = models.IntegerField(blank=False, null=False)
