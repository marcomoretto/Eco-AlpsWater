from django.db import models


class BiologicalElement(models.Model):
    name = models.TextField(blank=False, null=False)

    def to_dict(self):
        return {'id': self.id, 'name': self.name}
