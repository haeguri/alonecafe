from django.db import models
from django.utils import timezone
from geoposition.fields import GeopositionField
from django.core.urlresolvers import reverse_lazy

from PIL import Image


IMAGE_SIZE = (1536, 1028)

def get_upload_path(instance, filename):
    return instance.cafe.region.city + "/" + instance.cafe.name + timezone.now().strftime("/%y-%m-%d/") + filename

class Region(models.Model):
    city = models.CharField('광역시도', max_length=20)

    def __str__(self):
        return self.city
        # return self.city + " " + self.ward

class Cafe(models.Model):
    region = models.ForeignKey(Region, help_text='지역')
    name = models.CharField('카페 이름', max_length=20, blank=False, null=False)
    address = models.CharField('간략한 주소', max_length=10, blank=False, null=False)
    mood = models.CharField('분위기', max_length=10, blank=False, null=False)
    intro = models.TextField('추천이유', blank=False, null=False)
    has_solo_table =  models.BooleanField('1인 테이블', default=False, blank=True)
    created = models.DateTimeField('등록일', auto_now_add=True)

    def __str__(self):
        return self.region.city + " " + self.name

    def get_absolute_url(self):
        return reverse_lazy('main:cafe_detail', kwargs={'pk':self.id})

class CafePosition(models.Model):
    cafe = models.OneToOneField('Cafe', related_name='position')
    latitude  = models.CharField('위도', max_length=50, blank=False, null=False)
    longitude = models.CharField('경도', max_length=50, blank=False, null=False)

class CafePhoto(models.Model):
    cafe = models.ForeignKey(Cafe, related_name='photos')
    image = models.ImageField(upload_to=get_upload_path)

    def delete(self, *args, **kwargs):
        try:
            self.image.delete()
        except:
            print("이미 파일이 삭제 됐습니다.")

        super(CafePhoto, self).delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        super(CafePhoto, self).save(**kwargs)
        image = Image.open(self.image)
        image = image.resize(IMAGE_SIZE, Image.ANTIALIAS)
        image.save(self.image.path)




