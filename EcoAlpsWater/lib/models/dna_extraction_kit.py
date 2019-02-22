from django.db import models


class DNAExtractionKit(models.Model):
    name = models.TextField(blank=False, null=False)
