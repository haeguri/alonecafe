# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-10-29 10:39
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_auto_20161029_1912'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cafephoto',
            name='cafe',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='photos', to='main.Cafe'),
        ),
    ]