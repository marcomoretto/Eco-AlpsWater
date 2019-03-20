from django.db import models


class DrainageBasin(models.Model):
    TYPE = (
        ('Lake', 'L'),
        ('River', 'R')
    )
    COUNTRY = (
        ('Austria', 'A'),
        ('Switzerland', 'C'),
        ('France', 'F'),
        ('Germany', 'D'),
        ('Italy', 'I'),
        ('Slovenia', 'S')
    )
    name = models.TextField(blank=False, null=False)
    type = models.CharField(max_length=6, choices=TYPE)
    country = models.CharField(max_length=11, choices=COUNTRY)

    def to_dict(self):
        return {'id': self.id, 'name': self.name}
