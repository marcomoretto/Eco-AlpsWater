from django.db import models

from EcoAlpsWater.lib.models.station import Station


class GeographicalPoint(models.Model):
    station = models.ForeignKey(Station, on_delete=models.CASCADE, null=False, default=1)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    def to_dict(self):
        return {'id': self.id}
