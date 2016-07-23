from django.db import models
from django.utils import timezone
from geoposition.fields import GeopositionField

def get_upload_path(instance, filename):
    return instance.cafe.region.city + "/" + instance.cafe.region.ward + "/" + instance.cafe.name + timezone.now().strftime("/%y-%m-%d/") + filename

class Region(models.Model):
    city = models.CharField('광역시도', max_length=20)
    ward = models.CharField('자치구', max_length=10)

    def __str__(self):
        return self.city + " " + self.ward


class Cafe(models.Model):
    region = models.ForeignKey(Region)
    name = models.CharField('까페 이름', max_length=20, blank=False, null=False)
    address = models.CharField('간략한 주소', max_length=10, blank=False, null=False)
    mood = models.CharField('분위기', max_length=10, blank=False, null=False)
    week_hours = models.CharField('평일 영업시간', max_length=20, null=False, blank=False)
    satur_hours = models.CharField('토요일 영업시간', max_length=20, null=False, blank=False)
    sun_hours = models.CharField('휴일 영업시간', max_length=20, null=False, blank=False)
    has_solo_table =  models.BooleanField('1인 테이블 유무', null=False, blank=False)
    intro = models.TextField('50자 이내 소개')
    position = GeopositionField('까페 좌표')

    def __str__(self):
        return self.region.city + " " + self.region.ward + " " + self.name

class CafePhoto(models.Model):
    cafe = models.ForeignKey(Cafe, related_name='photos')
    image = models.ImageField(upload_to=get_upload_path)

    def delete(self, *args, **kwargs):
        self.image.delete()
        super(CafePhoto, self).delete(*args, **kwargs)



