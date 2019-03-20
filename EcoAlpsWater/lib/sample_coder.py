import math
import datetime

from EcoAlpsWater.lib.models.biological_element import BiologicalElement
from EcoAlpsWater.lib.models.depth_type import DepthType
from EcoAlpsWater.lib.models.drainage_basin import DrainageBasin


class SampleCoder:

    def __init__(self, biological_element_id, water_body, drainage_basin_id, depth, depth_type_id, sampling_date):
        self.biological_element_id = biological_element_id
        self.water_body = water_body
        self.drainage_basin_id = drainage_basin_id
        self.depth = depth
        self.depth_type_id = depth_type_id
        self.sampling_date = sampling_date
        self._starting_year = 2019

    def get_sample_id(self):
        sampling_month = '00'
        sampling_day = '00'
        sampling_year = ''
        if len(self.sampling_date) > 0 and self.sampling_date[0]:
            date = datetime.datetime.strptime(self.sampling_date[0], '%m/%d/%Y')
            sampling_year = date.year
            sampling_month = '%02d' % date.month,
            sampling_day = '%02d' % date.day,
            sampling_month = sampling_month[0]
            sampling_day = sampling_day[0]

        year = '0'
        if sampling_year:
            year = self._starting_year - sampling_year
            year = '%02d' % year

        sample_id = '00'
        if self.drainage_basin_id:
            sample_id = '%02d' % int(self.drainage_basin_id)

        dt = '0'
        if self.depth_type_id:
            dt = str(self.depth_type_id)

        depth = '000'
        if self.depth:
            depth = '%03d' % int(self.depth)

        be = '0'
        if self.biological_element_id:
            be = str(self.biological_element_id)

        return sample_id + year + sampling_month + sampling_day + dt + depth + be

    def get_sample_code(self):
        sampling_month = ''
        sampling_day = ''
        sampling_year = ''
        if len(self.sampling_date) > 0 and self.sampling_date[0]:
            date = datetime.datetime.strptime(self.sampling_date[0], '%m/%d/%Y')
            sampling_year = date.year
            sampling_month = '%02d' % date.month,
            sampling_day = '%02d' % date.day,
            sampling_month = sampling_month[0]
            sampling_day = sampling_day[0]

        drainage_basin = DrainageBasin.objects.filter(id=self.drainage_basin_id).first() or DrainageBasin()
        biological_element = BiologicalElement.objects.filter(id=self.biological_element_id).first() or BiologicalElement()
        depth_type = DepthType.objects.filter(id=self.depth_type_id).first() or DepthType()

        country = dict(DrainageBasin.COUNTRY).get(drainage_basin.country, '')
        db = self.water_body[0][0] if len(self.water_body) > 0 and self.water_body[0] and len(self.water_body[0]) > 0 else ''
        dt = depth_type.name[0] if len(depth_type.name) > 0 else ''
        if len(drainage_basin.name) >= 5:
            name = drainage_basin.name[:5]
        else:
            name = drainage_basin.name + ''.join(['x'] * (5 - len(drainage_basin.name)))
        be = biological_element.name[0] if biological_element.name else ''

        sample_code = '{country}_{db}_{name}_{year}_{month}_{day}_{layer}_{depth}_{be}'.format(
            country=country,
            db=db,
            name=name,
            year=sampling_year,
            month=sampling_month,
            day=sampling_day,
            layer=dt,
            depth=self.depth,
            be=be
        )

        return sample_code

    @staticmethod
    def convert_to_number(string_id):
        return int.from_bytes(string_id.encode(), 'little')

    @staticmethod
    def convert_from_number(number_id):
        return number_id.to_bytes(math.ceil(number_id.bit_length() / 8), 'little').decode()
