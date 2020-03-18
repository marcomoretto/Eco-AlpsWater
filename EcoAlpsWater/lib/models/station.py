from django.db import models

from EcoAlpsWater.lib.models.drainage_basin import DrainageBasin


class Station(models.Model):
    TYPE = (
        ('discrete', 'D'),
        ('multiple', 'M')
    )

    name = models.TextField(blank=False, null=False)
    pp_code = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=8, choices=TYPE, default='discrete')
    drainage_basin = models.ForeignKey(DrainageBasin, on_delete=models.CASCADE, null=False, default=1)

    class Meta:
        unique_together = ('name', 'drainage_basin',)

    def to_dict(self):
        return {'id': self.id,
                'name': self.name,
                'full_name': self.name + ' ({wb}, {wb_name})'.format(wb=self.drainage_basin.type, wb_name=self.drainage_basin.name),
                'water_body': self.drainage_basin.type,
                'water_body_name': self.drainage_basin.name,
                'station_type': self.type.capitalize(),
                'latitude': ':'.join([str(gp.latitude) for gp in self.geographicalpoint_set.all()]),
                'longitude': ':'.join([str(gp.longitude) for gp in self.geographicalpoint_set.all()])
                }
