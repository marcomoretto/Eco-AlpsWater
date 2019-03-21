# Generated by Django 2.1.7 on 2019-03-21 08:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='BiologicalElement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('field_name', models.TextField()),
                ('comment', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='ControlledVocabulary',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('description', models.TextField(blank=True, null=True)),
                ('url', models.URLField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='CyanotoxinSamples',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='DepthType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='DNAExtractionKit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='DrainageBasin',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('type', models.CharField(choices=[('Lake', 'L'), ('River', 'R')], max_length=6)),
                ('country', models.CharField(choices=[('Austria', 'A'), ('Switzerland', 'C'), ('France', 'F'), ('Germany', 'D'), ('Italy', 'I'), ('Slovenia', 'S')], max_length=11)),
            ],
        ),
        migrations.CreateModel(
            name='EAWUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('institute', models.TextField(blank=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='EDNAMarker',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='FieldControlledVocabularyTerm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('field_name', models.TextField()),
                ('controlled_vocabulary_term', models.TextField()),
                ('controlled_vocabulary', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='EcoAlpsWater.ControlledVocabulary')),
            ],
        ),
        migrations.CreateModel(
            name='FieldDescription',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('field_name', models.TextField()),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='MixingType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='NumericalCodeMapping',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('field_name', models.TextField()),
                ('code_position', models.IntegerField()),
                ('num_digits', models.IntegerField()),
                ('num_code', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='PhytoplanktonCountings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Sample',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sample_id', models.TextField(unique=True)),
                ('sample_code', models.TextField(unique=True)),
                ('cap_code', models.TextField(blank=True, null=True)),
                ('sampling_date', models.DateTimeField(auto_now_add=True)),
                ('sampling_depth', models.FloatField()),
                ('mean_river_outflow', models.FloatField(blank=True, null=True)),
                ('catchment_area', models.FloatField(blank=True, null=True)),
                ('sampling_latitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True)),
                ('sampling_longitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True)),
                ('temperature', models.FloatField(blank=True, null=True)),
                ('field_ph', models.FloatField(blank=True, null=True)),
                ('conductivity_ph', models.FloatField(blank=True, null=True)),
                ('light_attenuation_coefficient', models.FloatField(blank=True, null=True)),
                ('secchi_disk_depth', models.FloatField(blank=True, null=True)),
                ('euphotic_layer', models.FloatField(blank=True, null=True)),
                ('oxygen_concentration', models.FloatField(blank=True, null=True)),
                ('oxygen_percentage', models.FloatField(blank=True, null=True)),
                ('laboratory_ph', models.FloatField(blank=True, null=True)),
                ('laboratory_conductivity', models.FloatField(blank=True, null=True)),
                ('total_alkalinity', models.FloatField(blank=True, null=True)),
                ('bicarbonates', models.FloatField(blank=True, null=True)),
                ('nitrate_nitrogen', models.FloatField(blank=True, null=True)),
                ('sulphates', models.FloatField(blank=True, null=True)),
                ('chloride', models.FloatField(blank=True, null=True)),
                ('calcium', models.FloatField(blank=True, null=True)),
                ('magnesium', models.FloatField(blank=True, null=True)),
                ('sodium', models.FloatField(blank=True, null=True)),
                ('potassium', models.FloatField(blank=True, null=True)),
                ('ammonium', models.FloatField(blank=True, null=True)),
                ('total_nitrogen', models.FloatField(blank=True, null=True)),
                ('soluble_reactive_phosphorus', models.FloatField(blank=True, null=True)),
                ('total_phosphorus', models.FloatField(blank=True, null=True)),
                ('reactive_silica', models.FloatField(blank=True, null=True)),
                ('dry_weight', models.FloatField(blank=True, null=True)),
                ('chlorophyll_a', models.FloatField(blank=True, null=True)),
                ('dna_extraction_date', models.DateTimeField(blank=True, null=True)),
                ('biological_element', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='EcoAlpsWater.BiologicalElement')),
                ('cyanotoxin_samples', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='EcoAlpsWater.CyanotoxinSamples')),
                ('depth_type', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='EcoAlpsWater.DepthType')),
                ('dna_extraction_kit', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='EcoAlpsWater.DNAExtractionKit')),
                ('drainage_basin', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='EcoAlpsWater.DrainageBasin')),
                ('edna_marker', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='EcoAlpsWater.EDNAMarker')),
                ('mixing_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='EcoAlpsWater.MixingType')),
                ('phytoplankton_countings', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='EcoAlpsWater.PhytoplanktonCountings')),
            ],
        ),
        migrations.CreateModel(
            name='Station',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('pp_code', models.TextField(blank=True, null=True)),
                ('drainage_basin', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='EcoAlpsWater.DrainageBasin')),
            ],
        ),
        migrations.CreateModel(
            name='VerticalTemperatureProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
            ],
        ),
        migrations.AddField(
            model_name='sample',
            name='station',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='EcoAlpsWater.Station'),
        ),
        migrations.AddField(
            model_name='sample',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='sample',
            name='vertical_temperature_profiles',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='EcoAlpsWater.VerticalTemperatureProfile'),
        ),
        migrations.AddField(
            model_name='comment',
            name='sample',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='EcoAlpsWater.Sample'),
        ),
        migrations.AlterUniqueTogether(
            name='comment',
            unique_together={('sample', 'field_name')},
        ),
    ]
