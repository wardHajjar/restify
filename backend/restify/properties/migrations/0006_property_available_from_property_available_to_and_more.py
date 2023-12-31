# Generated by Django 4.1.7 on 2023-03-18 06:45

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0005_remove_property_amenities_property_bathrooms_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='available_from',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='property',
            name='available_to',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='property',
            name='price',
            field=models.FloatField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1)]),
        ),
        migrations.DeleteModel(
            name='Availability',
        ),
    ]
