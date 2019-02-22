from django.db import models


class ControlledVocabulary(models.Model):
    name = models.TextField(blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    url = models.URLField(blank=True, null=True)
