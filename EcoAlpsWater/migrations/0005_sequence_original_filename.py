# Generated by Django 2.1.7 on 2020-02-20 13:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('EcoAlpsWater', '0004_auto_20200213_1344'),
    ]

    operations = [
        migrations.AddField(
            model_name='sequence',
            name='original_filename',
            field=models.TextField(default='test'),
            preserve_default=False,
        ),
    ]