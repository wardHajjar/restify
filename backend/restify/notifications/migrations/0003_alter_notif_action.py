# Generated by Django 4.1.7 on 2023-04-19 08:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0002_notif_state_alter_notif_action'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notif',
            name='action',
            field=models.CharField(blank=True, choices=[('cancel-request', 'cancel-request'), ('new-reservation', 'new-reservation'), ('cancel-approve', 'cancel-approve'), ('request-approve', 'request-approve'), ('cancel-deny', 'cancel-deny'), ('request-deny', 'request-deny')], max_length=15, null=True),
        ),
    ]
