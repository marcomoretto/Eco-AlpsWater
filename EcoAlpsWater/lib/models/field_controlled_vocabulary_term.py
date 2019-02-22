from django.db import models

from EcoAlpsWater.lib.models.controlled_vocabulary import ControlledVocabulary


class FieldControlledVocabularyTerm(models.Model):
    controlled_vocabulary = models.ForeignKey(ControlledVocabulary, on_delete=models.CASCADE, null=False, default=1)
    field_name = models.TextField(blank=False, null=False)
    controlled_vocabulary_term = models.TextField(blank=False, null=False)

