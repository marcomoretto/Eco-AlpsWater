from django.db import models


class FieldDescription(models.Model):
    field_name = models.TextField(blank=False, null=False)
    description = models.TextField(blank=False, null=False)

    def to_dict(self):
        return {
            'field_name': self.field_name,
            'description': self.description
        }
