# Generated by Django 4.1.7 on 2023-03-18 00:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='restifyuser',
            managers=[
            ],
        ),
        migrations.AlterField(
            model_name='restifyuser',
            name='username',
            field=models.CharField(max_length=50, unique=True),
        ),
    ]
