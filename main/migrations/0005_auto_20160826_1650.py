# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-08-26 07:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_auto_20160826_1646'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cafe',
            name='has_solo_table',
            field=models.BooleanField(default=False, verbose_name='1인 테이블 유무'),
        ),
        migrations.AlterField(
            model_name='cafe',
            name='intro',
            field=models.TextField(verbose_name='간단소개'),
        ),
        migrations.AlterField(
            model_name='cafe',
            name='satur_hours',
            field=models.CharField(blank=True, max_length=20, null=True, verbose_name='토요일 영업시간'),
        ),
        migrations.AlterField(
            model_name='cafe',
            name='sun_hours',
            field=models.CharField(blank=True, max_length=20, null=True, verbose_name='휴일 영업시간'),
        ),
        migrations.AlterField(
            model_name='cafe',
            name='week_hours',
            field=models.CharField(blank=True, max_length=20, null=True, verbose_name='평일 영업시간'),
        ),
    ]
