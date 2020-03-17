from django.db import models

from EcoAlpsWater.lib.models.biological_element import BiologicalElement
from EcoAlpsWater.lib.models.depth_type import DepthType
from EcoAlpsWater.lib.models.dna_extraction_kit import DNAExtractionKit
from EcoAlpsWater.lib.models.dna_quantification_method import DNAQuantificationMethod
from EcoAlpsWater.lib.models.edna_marker import EDNAMarker
from EcoAlpsWater.lib.models.mixing_type import MixingType
from EcoAlpsWater.lib.models.sampling_matrix import SamplingMatrix
from EcoAlpsWater.lib.models.sampling_strategy import SamplingStrategy
from EcoAlpsWater.lib.models.station import Station
from django.contrib.auth.models import User


class Sample(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, blank=False, null=False, default=1)
    sample_id = models.TextField(blank=False, null=False, unique=True)
    sample_code = models.TextField(blank=False, null=False, unique=True)
    cap_code = models.TextField(blank=True, null=True)
    station = models.ForeignKey(Station, on_delete=models.CASCADE, null=False, default=1)
    sampling_date = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    sampling_depth_min = models.FloatField(null=False, blank=False)
    sampling_depth_max = models.FloatField(null=False, blank=False)
    sampling_volume = models.FloatField(null=True, blank=True)
    depth_type = models.ForeignKey(DepthType, on_delete=models.CASCADE, null=False, default=1)
    edna_marker = models.ForeignKey(EDNAMarker, on_delete=models.CASCADE, null=True, default=1)
    biological_element = models.ForeignKey(BiologicalElement, on_delete=models.CASCADE, null=True, default=1)
    sampling_matrix = models.ForeignKey(SamplingMatrix, on_delete=models.CASCADE, null=False, default=1)
    sampling_strategy = models.ForeignKey(SamplingStrategy, on_delete=models.CASCADE, null=False, default=1)
    mean_river_outflow = models.FloatField(null=True, blank=True)
    mixing_type = models.ForeignKey(MixingType, on_delete=models.CASCADE, null=True, blank=True)
    catchment_area = models.FloatField(null=True, blank=True)
    temperature = models.FloatField(null=True, blank=True)
    field_ph = models.FloatField(null=True, blank=True)
    field_conductivity = models.FloatField(null=True, blank=True)
    light_attenuation_coefficient = models.FloatField(null=True, blank=True)
    secchi_disk_depth = models.FloatField(null=True, blank=True)
    euphotic_layer = models.FloatField(null=True, blank=True)
    oxygen_concentration = models.FloatField(null=True, blank=True)
    oxygen_percentage = models.FloatField(null=True, blank=True)
    laboratory_ph = models.FloatField(null=True, blank=True)
    laboratory_conductivity = models.FloatField(null=True, blank=True)
    total_alkalinity = models.FloatField(null=True, blank=True)
    bicarbonates = models.FloatField(null=True, blank=True)
    nitrate_nitrogen = models.FloatField(null=True, blank=True)
    sulphates = models.FloatField(null=True, blank=True)
    chloride = models.FloatField(null=True, blank=True)
    calcium = models.FloatField(null=True, blank=True)
    magnesium = models.FloatField(null=True, blank=True)
    sodium = models.FloatField(null=True, blank=True)
    potassium = models.FloatField(null=True, blank=True)
    ammonium = models.FloatField(null=True, blank=True)
    total_nitrogen = models.FloatField(null=True, blank=True)
    soluble_reactive_phosphorus = models.FloatField(null=True, blank=True)
    total_phosphorus = models.FloatField(null=True, blank=True)
    reactive_silica = models.FloatField(null=True, blank=True)
    dry_weight = models.FloatField(null=True, blank=True)
    chlorophyll_a = models.FloatField(null=True, blank=True)
    dna_extraction_kit = models.ForeignKey(DNAExtractionKit, on_delete=models.CASCADE, null=True, blank=True)
    dna_extraction_date = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    dna_quantity = models.FloatField(null=True, blank=True)
    dna_quantification_method = models.ForeignKey(DNAQuantificationMethod, on_delete=models.CASCADE, null=True, blank=True)
    dna_quality_a260_280 = models.FloatField(null=True, blank=True)
    dna_quality_a260_230 = models.FloatField(null=True, blank=True)
    vertical_temperature_profiles = models.BinaryField()
    phytoplankton_countings = models.BinaryField()
    cyanotoxin_samples = models.BinaryField()

    def to_dict_description(self, *args, **kwargs):
        d = {
            #'id': self.id,
            'sample_id': self.sample_id,
            'sample_code': self.sample_code,
            #'biological_element': self.biological_element.name if self.biological_element else None,
            'sampling_matrix': self.sampling_matrix.name if self.sampling_matrix else None,
            'sampling_strategy': self.sampling_strategy.name if self.sampling_strategy else None,
            'station': self.station.name if self.station else None,
            'sampling_date': self.sampling_date.strftime('%m-%d-%Y'),
            'sampling_depth_min': self.sampling_depth_min,
            'sampling_depth_max': self.sampling_depth_max,
            'sampling_volume': self.sampling_volume,
            'depth_type': self.depth_type.name if self.depth_type else None,
            #'edna_marker': self.edna_marker.name if self.edna_marker else None,
            'mean_river_outflow': self.mean_river_outflow,
            'mixing_type': self.mixing_type.name if self.mixing_type else None,
            'catchment_area': self.catchment_area,
            'temperature': self.temperature,
            'field_ph': self.field_ph,
            'field_conductivity': self.field_conductivity,
            'light_attenuation_coefficient': self.light_attenuation_coefficient,
            'secchi_disk_depth': self.secchi_disk_depth,
            'euphotic_layer': self.euphotic_layer,
            'oxygen_concentration': self.oxygen_concentration,
            'oxygen_percentage': self.oxygen_percentage,
            'laboratory_ph': self.laboratory_ph,
            'laboratory_conductivity': self.laboratory_conductivity,
            'total_alkalinity': self.total_alkalinity,
            'bicarbonates': self.bicarbonates,
            'nitrate_nitrogen': self.nitrate_nitrogen,
            'sulphates': self.sulphates,
            'chloride': self.chloride,
            'calcium': self.calcium,
            'magnesium': self.magnesium,
            'sodium': self.sodium,
            'potassium': self.potassium,
            'ammonium': self.ammonium,
            'total_nitrogen': self.total_nitrogen,
            'soluble_reactive_phosphorus': self.soluble_reactive_phosphorus,
            'total_phosphorus': self.total_phosphorus,
            'reactive_silica': self.reactive_silica,
            'dry_weight': self.dry_weight,
            'chlorophyll_a': self.chlorophyll_a,
            'dna_extraction_kit': self.dna_extraction_kit.name if self.dna_extraction_kit else None,
            'dna_extraction_date': self.dna_extraction_date.strftime('%m-%d-%Y') if self.dna_extraction_date else None,
            'dna_quantity': self.dna_quantity,
            'dna_quantification_method': self.dna_quantification_method.name if self.dna_quantification_method else None,
            'dna_quality_a260_230': self.dna_quality_a260_230,
            'dna_quality_a260_280': self.dna_quality_a260_280
        }
        for k, v in kwargs.items():
            d[k] = getattr(self, v)
        return d

    def to_dict_complete(self):
        return {
            #'id': self.id,
            'sample_id': self.sample_id,
            'sample_code': self.sample_code,
            #'biological_element': self.biological_element_id,
            'sampling_matrix': self.sampling_matrix_id,
            'sampling_strategy': self.sampling_strategy_id,
            'station': self.station_id,
            'sampling_date': self.sampling_date.strftime('%m-%d-%Y'),
            'sampling_depth_min': self.sampling_depth_min,
            'sampling_depth_max': self.sampling_depth_max,
            'sampling_volume': self.sampling_volume,
            'depth_type': self.depth_type_id,
            #'edna_marker': self.edna_marker_id,
            'mean_river_outflow': self.mean_river_outflow,
            'mixing_type': self.mixing_type_id,
            'catchment_area': self.catchment_area,
            'temperature': self.temperature,
            'field_ph': self.field_ph,
            'field_conductivity': self.field_conductivity,
            'light_attenuation_coefficient': self.light_attenuation_coefficient,
            'secchi_disk_depth': self.secchi_disk_depth,
            'euphotic_layer': self.euphotic_layer,
            'oxygen_concentration': self.oxygen_concentration,
            'oxygen_percentage': self.oxygen_percentage,
            'laboratory_ph': self.laboratory_ph,
            'laboratory_conductivity': self.laboratory_conductivity,
            'total_alkalinity': self.total_alkalinity,
            'bicarbonates': self.bicarbonates,
            'nitrate_nitrogen': self.nitrate_nitrogen,
            'sulphates': self.sulphates,
            'chloride': self.chloride,
            'calcium': self.calcium,
            'magnesium': self.magnesium,
            'sodium': self.sodium,
            'potassium': self.potassium,
            'ammonium': self.ammonium,
            'total_nitrogen': self.total_nitrogen,
            'soluble_reactive_phosphorus': self.soluble_reactive_phosphorus,
            'total_phosphorus': self.total_phosphorus,
            'reactive_silica': self.reactive_silica,
            'dry_weight': self.dry_weight,
            'chlorophyll_a': self.chlorophyll_a,
            'dna_extraction_kit': self.dna_extraction_kit_id,
            'dna_extraction_date': self.dna_extraction_date.strftime('%m-%d-%Y') if self.dna_extraction_date else None,
            'dna_quantity': self.dna_quantity,
            'dna_quantification_method': self.dna_quantification_method_id,
            'dna_quality_a260_230': self.dna_quality_a260_230,
            'dna_quality_a260_280': self.dna_quality_a260_280
        }

    def to_dict(self):
        return {
            'id': self.id,
            'sample_id': self.sample_id,
            'sample_code': self.sample_code,
            #'biological_element': self.biological_element.name,
            'station': self.station.name,
            'water_body': self.station.drainage_basin.type,
            'water_body_name': self.station.drainage_basin.name,
            'sampling_date': self.sampling_date.strftime('%m-%d-%Y'),
            'sampling_depth': str(self.sampling_depth_min) + ' - ' + str(self.sampling_depth_max),
            'sampling_volume': self.sampling_volume,
            'depth_type': self.depth_type.name,
            #'edna_marker': self.edna_marker.name
        }

