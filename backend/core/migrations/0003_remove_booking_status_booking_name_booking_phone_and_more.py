# Generated by Django 5.2.4 on 2025-07-14 19:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_booking_latitude_booking_longitude'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='booking',
            name='status',
        ),
        migrations.AddField(
            model_name='booking',
            name='name',
            field=models.CharField(default='Unknown', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='booking',
            name='phone',
            field=models.CharField(default='0000000000', max_length=15),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='booking',
            name='subservices',
            field=models.ManyToManyField(to='core.subservice'),
        ),
    ]
