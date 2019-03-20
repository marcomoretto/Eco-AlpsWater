from django.db import models

from EcoAlpsWater.lib.models.drainage_basin import DrainageBasin


class Station(models.Model):
    name = models.TextField(blank=False, null=False)
    pp_code = models.TextField(blank=True, null=True)
    drainage_basin = models.ForeignKey(DrainageBasin, on_delete=models.CASCADE, null=False, default=1)

    def to_dict(self):
        return {'id': self.id, 'name': self.name}
