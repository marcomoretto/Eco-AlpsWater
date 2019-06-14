from django.db import models

from EcoAlpsWater.lib.models.biological_element import BiologicalElement
from EcoAlpsWater.lib.models.cyanotoxin_samples import CyanotoxinSamples
from EcoAlpsWater.lib.models.depth_type import DepthType
from EcoAlpsWater.lib.models.dna_extraction_kit import DNAExtractionKit
from EcoAlpsWater.lib.models.drainage_basin import DrainageBasin
from EcoAlpsWater.lib.models.edna_marker import EDNAMarker
from EcoAlpsWater.lib.models.mixing_type import MixingType
from EcoAlpsWater.lib.models.phytoplankton_countings import PhytoplanktonCountings
from EcoAlpsWater.lib.models.station import Station
from EcoAlpsWater.lib.models.vertical_temperature_profile import VerticalTemperatureProfile
from django.contrib.auth.models import User


class Sample(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, blank=False, null=False, default=1)
    sample_id = models.TextField(blank=False, null=False, unique=True)
    sample_code = models.TextField(blank=False, null=False, unique=True)
    drainage_basin = models.ForeignKey(DrainageBasin, on_delete=models.CASCADE, null=False, default=1)
    cap_code = models.TextField(blank=True, null=True)
    station = models.ForeignKey(Station, on_delete=models.CASCADE, null=False, default=1)
    sampling_date = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    sampling_depth = models.FloatField(null=False, blank=False)
    depth_type = models.ForeignKey(DepthType, on_delete=models.CASCADE, null=False, default=1)
    edna_marker = models.ForeignKey(EDNAMarker, on_delete=models.CASCADE, null=False, default=1)
    biological_element = models.ForeignKey(BiologicalElement, on_delete=models.CASCADE, null=False, default=1)
    mean_river_outflow = models.FloatField(null=True, blank=True)
    mixing_type = models.ForeignKey(MixingType, on_delete=models.CASCADE, null=True, blank=True)
    catchment_area = models.FloatField(null=True, blank=True)
    sampling_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    sampling_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    temperature = models.FloatField(null=True, blank=True)
    field_ph = models.FloatField(null=True, blank=True)
    conductivity_ph = models.FloatField(null=True, blank=True)
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
    vertical_temperature_profiles = models.ForeignKey(VerticalTemperatureProfile, on_delete=models.CASCADE, null=True, blank=True)
    phytoplankton_countings = models.ForeignKey(PhytoplanktonCountings, on_delete=models.CASCADE, null=True, blank=True)
    cyanotoxin_samples = models.ForeignKey(CyanotoxinSamples, on_delete=models.CASCADE, null=True, blank=True)

    def to_dict_description(self):
        return {
            #'id': self.id,
            'sample_id': self.sample_id,
            'sample_code': self.sample_code,
            'biological_element': self.biological_element.name if self.biological_element else None,
            'water_body': self.drainage_basin.type,
            'water_body_name': self.drainage_basin.name if self.drainage_basin else None,
            'station': self.station.name if self.station else None,
            'sampling_date': self.sampling_date.strftime('%Y-%m-%d'),
            'sampling_depth': self.sampling_depth,
            'depth_type': self.depth_type.name if self.depth_type else None,
            'edna_marker': self.edna_marker.name if self.edna_marker else None,
            'mean_river_outflow': self.mean_river_outflow,
            'mixing_type': self.mixing_type.name if self.mixing_type else None,
            'catchment_area': self.catchment_area,
            'sampling_latitude': float(self.sampling_latitude) if self.sampling_latitude else None,
            'sampling_longitude': float(self.sampling_longitude) if self.sampling_longitude else None,
            'temperature': self.temperature,
            'field_ph': self.field_ph,
            'conductivity_ph': self.conductivity_ph,
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
            'dna_extraction_date': self.dna_extraction_date.strftime('%Y-%m-%d') if self.dna_extraction_date else None,
            'vertical_temperature_profiles': self.vertical_temperature_profiles.name if self.vertical_temperature_profiles else None,
            'phytoplankton_countings': self.phytoplankton_countings.name if self.phytoplankton_countings else None,
            'cyanotoxin_samples': self.cyanotoxin_samples.name if self.cyanotoxin_samples else None
        }

    def to_dict_complete(self):
        return {
            #'id': self.id,
            'sample_id': self.sample_id,
            'sample_code': self.sample_code,
            'biological_element': self.biological_element_id,
            'water_body': self.drainage_basin.type,
            'water_body_name': self.drainage_basin_id,
            'station': self.station_id,
            'sampling_date': self.sampling_date.strftime('%Y-%m-%d'),
            'sampling_depth': self.sampling_depth,
            'depth_type': self.depth_type_id,
            'edna_marker': self.edna_marker_id,
            'mean_river_outflow': self.mean_river_outflow,
            'mixing_type': self.mixing_type_id,
            'catchment_area': self.catchment_area,
            'sampling_latitude': float(self.sampling_latitude) if self.sampling_latitude else None,
            'sampling_longitude': float(self.sampling_longitude) if self.sampling_longitude else None,
            'temperature': self.temperature,
            'field_ph': self.field_ph,
            'conductivity_ph': self.conductivity_ph,
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
            'dna_extraction_date': self.dna_extraction_date.strftime('%Y-%m-%d') if self.dna_extraction_date else None,
            'vertical_temperature_profiles': self.vertical_temperature_profiles_id,
            'phytoplankton_countings': self.phytoplankton_countings_id,
            'cyanotoxin_samples': self.cyanotoxin_samples_id
        }

    def to_dict(self):
        return {
            'id': self.id,
            'sample_id': self.sample_id,
            'sample_code': self.sample_code,
            'biological_element': self.biological_element.name,
            'water_body': self.drainage_basin.type,
            'water_body_name': self.drainage_basin.name,
            'station': self.station.name,
            'sampling_date': self.sampling_date.strftime('%Y-%m-%d'),
            'sampling_depth': self.sampling_depth,
            'depth_type': self.depth_type.name,
            'edna_marker': self.edna_marker.name
        }

