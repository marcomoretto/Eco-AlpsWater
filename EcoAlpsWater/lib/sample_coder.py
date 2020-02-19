import math
import datetime

#from EcoAlpsWater.lib.models.biological_element import BiologicalElement
from EcoAlpsWater.lib.models.depth_type import DepthType
from EcoAlpsWater.lib.models.drainage_basin import DrainageBasin
from EcoAlpsWater.lib.models.sampling_matrix import SamplingMatrix
from EcoAlpsWater.lib.models.sampling_strategy import SamplingStrategy
from EcoAlpsWater.lib.models.station import Station


class SampleCoder:

    def __init__(self, biological_element_id, station_id, depth_min, depth_max, depth_type_id, sampling_date, sampling_matrix_id, sampling_strategy_id):
        #self.biological_element_id = biological_element_id
        self.station_id = station_id
        self.depth_min = depth_min
        self.depth_max = depth_max
        self.depth_type_id = depth_type_id
        self.sampling_date = sampling_date
        self._starting_year = 2019
        self.sampling_matrix_id = sampling_matrix_id
        self.sampling_strategy_id = sampling_strategy_id

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
            year = sampling_year - self._starting_year
            year = '%02d' % year

        sample_id = '00'
        if self.station_id:
            sample_id = '%02d' % int(Station.objects.get(id=self.station_id).drainage_basin_id)

        dt = '0'
        if self.depth_type_id:
            dt = str(self.depth_type_id)

        depth_min = '000'
        if self.depth_min:
            depth_min = '%03d' % float(self.depth_min)

        depth_max = '000'
        if self.depth_max:
            depth_max = '%03d' % float(self.depth_max)

        #be = '0'
        #if self.biological_element_id:
        #    be = str(self.biological_element_id)

        sm = '0'
        if self.sampling_matrix_id:
            sm = str(self.sampling_matrix_id)

        ss = '0'
        if self.sampling_strategy_id:
            ss = str(self.sampling_strategy_id)

        st = '00'
        if self.station_id:
            st = '%02d' % int(self.station_id)

        return sample_id + year + sampling_month + sampling_day + dt + depth_min + depth_max + sm + ss + st

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

        station = Station.objects.filter(id=self.station_id).first() or Station()
        drainage_basin = station.drainage_basin if self.station_id else DrainageBasin()
        #biological_element = BiologicalElement.objects.filter(id=self.biological_element_id).first() or BiologicalElement()
        depth_type = DepthType.objects.filter(id=self.depth_type_id).first() or DepthType()
        sampling_matrix = SamplingMatrix.objects.filter(id=self.sampling_matrix_id).first() or SamplingMatrix()
        sampling_strategy = SamplingStrategy.objects.filter(id=self.sampling_strategy_id).first() or SamplingStrategy()

        country = dict(DrainageBasin.COUNTRY).get(drainage_basin.country, '')
        water_body = station.drainage_basin.type if self.station_id else ''
        db = dict(DrainageBasin.TYPE).get(water_body, '')
        dt = depth_type.code
        if len(drainage_basin.name) >= 5:
            name = drainage_basin.name[:5]
        else:
            name = drainage_basin.name + ''.join(['x'] * (5 - len(drainage_basin.name)))
        #be = biological_element.code
        st = '%02d' % int(self.station_id) if self.station_id else '00'
        sm = sampling_matrix.code
        ss = sampling_strategy.code

        sample_code = '{country}_{db}_{name}_{year}_{month}_{day}_{layer}_{depth_min}_{depth_max}_{sm}_{ss}_{st}'.format(
            country=country,
            db=db,
            name=name,
            year=sampling_year,
            month=sampling_month,
            day=sampling_day,
            layer=dt,
            depth_min=self.depth_min,
            depth_max=self.depth_max,
            sm=sm,
            ss=ss,
            st=st
        )

        return sample_code

    @staticmethod
    def convert_to_number(string_id):
        return int.from_bytes(string_id.encode(), 'little')

    @staticmethod
    def convert_from_number(number_id):
        return number_id.to_bytes(math.ceil(number_id.bit_length() / 8), 'little').decode()
