# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-08-26 08:22
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_auto_20160826_1650'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='region',
            name='ward',
        ),
    ]