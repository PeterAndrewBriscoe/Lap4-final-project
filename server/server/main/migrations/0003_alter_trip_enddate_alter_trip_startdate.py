# Generated by Django 4.0.2 on 2022-02-08 12:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_trip_enddate_trip_startdate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trip',
            name='enddate',
            field=models.PositiveBigIntegerField(default=None, null=True),
        ),
        migrations.AlterField(
            model_name='trip',
            name='startdate',
            field=models.PositiveBigIntegerField(default=None, null=True),
        ),
    ]