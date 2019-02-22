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


class Sample(models.Model):
    sample_id = models.TextField(blank=False, null=False)
    sample_code = models.TextField(blank=False, null=False)
    drainage_basin = models.ForeignKey(DrainageBasin, on_delete=models.CASCADE, null=False, default=1)
    cap_code = models.TextField(blank=False, null=False)
    station = models.ForeignKey(Station, on_delete=models.CASCADE, null=False, default=1)
    sampling_date = models.DateTimeField(auto_now_add=False, blank=False, null=False)
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
    vertical_temperature_profiles = models.ForeignKey(VerticalTemperatureProfile, on_delete=models.CASCADE, null=True, blank=True)
    phytoplankton_countings = models.ForeignKey(PhytoplanktonCountings, on_delete=models.CASCADE, null=True, blank=True)
    cyanotoxin_samples = models.ForeignKey(CyanotoxinSamples, on_delete=models.CASCADE, null=True, blank=True)

