from django.db import models


class BiologicalElement(models.Model):
    name = models.TextField(blank=False, null=False)
