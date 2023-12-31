# Generated by Django 4.1.7 on 2023-03-18 06:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0004_property_description'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='property',
            name='amenities',
        ),
        migrations.AddField(
            model_name='property',
            name='bathrooms',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='property',
            name='bbq',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='property',
            name='bedrooms',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='property',
            name='city',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='property',
            name='country',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='property',
            name='heating',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='property',
            name='jacuzzi',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='property',
            name='kitchen',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='property',
            name='laundry',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='property',
            name='parking',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='property',
            name='pets',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='property',
            name='pool',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='property',
            name='postal_code',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='property',
            name='self_checkin',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='property',
            name='wifi',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='property',
            name='address2',
            field=models.CharField(blank=True, max_length=225, null=True),
        ),
    ]
