from django.db import models

from EcoAlpsWater.lib.models.edna_marker import EDNAMarker


class BiologicalElement(models.Model):
    name = models.TextField(blank=False, null=False)
    code = models.TextField(blank=False, null=False)
    edna_marker = models.ForeignKey(EDNAMarker, on_delete=models.CASCADE, null=False, default=1)

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'code': self.code, 'edna_marker': self.edna_marker.to_dict()}
