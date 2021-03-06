# Generated by Django 2.1.7 on 2020-02-13 08:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('EcoAlpsWater', '0002_auto_20200211_0735'),
    ]

    operations = [
        migrations.CreateModel(
            name='Sequence',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('filename', models.TextField()),
                ('md5sum', models.TextField()),
                ('upload_date', models.DateTimeField(auto_now_add=True)),
                ('sample', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='EcoAlpsWater.Sample')),
            ],
        ),
    ]
