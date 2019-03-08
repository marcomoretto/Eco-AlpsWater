from django.db import models


class FieldDescription(models.Model):
    field_name = models.TextField(blank=False, null=False)
    description = models.TextField(blank=False, null=False)
