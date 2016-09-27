from django.shortcuts import render, redirect
from .models import *
from .forms import *
from django.forms import inlineformset_factory

cafe_init_data = {
    'region': Region.objects.get(city="대구"),
    'name': '테스트 카페',
    'address': '테스트 주소',
    'mood': '테스트 분위기',
    'intro': '테스트 간략한 설명..',
    'has_solo_table': True
}

cafepos_init_data = {
    'latitude':'35.2',
    'longitude':'23.5'
}

def cafe_list(request):
    cafes = Cafe.objects.all().order_by('-created')

    return render(request, 'main/cafe_list.html', {'cafes': cafes})

def cafe_detail(request, pk):

    cafe = Cafe.objects.get(pk=pk)

    if len(cafe.photos.all()) != 0:
        img = cafe.photos.all()[0].image.url
    else:
        img = ''

        """
        region = models.ForeignKey(Region)
    name = models.CharField('까페 이름', max_length=20, blank=False, null=False)
    address = models.CharField('간략한 주소', max_length=10, blank=False, null=False)
    mood = models.CharField('분위기', max_length=10, blank=False, null=False)
    intro = models.TextField('간단소개', blank=False, null=False)
    has_solo_table =  models.BooleanField('1인 테이블', default=False, blank=True)
    week_hours = models.CharField('평일 영업시간', max_length=20, null=True, blank=True)
    satur_hours = models.CharField('토요일 영업시간', max_length=20, null=True, blank=True)
    sun_hours = models.CharField('휴일 영업시간', max_length=20, null=True, blank=True)
    created = models.DateTimeField('등록일', auto_now_add=True)

        """

    # context = {
    #     'img':img,
    #     'img_list':[photo.image.url for photo in cafe.photos.all()[:]],
    #     'cafe':cafe
    # }

    response_data = {
        'region':cafe.region.city,
        'img_list':[cafe_photo.image.url  for cafe_photo in cafe.photos.all()],
        'name':cafe.name,
        'address':cafe.address,
        'mood':cafe.mood,
        'intro':cafe.intro,
        'has_solo_table':cafe.has_solo_table,
        'week_hours':cafe.week_hours,
        'satur_hours':cafe.satur_hours,
        'sun_hours':cafe.sun_hours,
        'created':cafe.created.strftime("%y-%m-%d"),
    }

    try:
        response_data['pos'] = cafe.position.latitude + ',' + cafe.position.longitude
    except:
        response_data['pos'] = ''

    import json
    from django.http import HttpResponse

    return HttpResponse(json.dumps(response_data), content_type="application/json", charset="utf-8")

    # return render(request, '', context)





    # return render(request, 'main/cafe_detail.html', context)

def cafe_new(request):
    CafePhotoFormSet = inlineformset_factory(Cafe, CafePhoto, fields=('cafe', 'image',), labels={'image':''}, can_delete=False, extra=3)
    CafePositionFormSet = inlineformset_factory(Cafe, CafePosition, fields=('latitude', 'longitude',), can_delete=False, extra=1)

    if request.method == 'POST':
        cafe_form = CafeForm(data=request.POST)

        if cafe_form.is_valid():

            new_cafe = cafe_form.save(commit=False)
            cafephoto_formset = CafePhotoFormSet(request.POST, request.FILES, instance=new_cafe)
            cafepos_formset = CafePositionFormSet(request.POST, request.FILES, instance=new_cafe)

            if cafephoto_formset.is_valid() and cafepos_formset.is_valid():
                new_cafe.save()
                cafephoto_formset.save()
                cafepos_formset.save()

                return redirect(new_cafe.get_absolute_url())

            else:
                print(cafephoto_formset.errors)

        else:
            print("cafe_form is_valid is not true")
            print(cafe_form.errors)

    else:
        cafephoto_formset = CafePhotoFormSet()
        cafepos_formset = CafePositionFormSet()

        for cafepos in cafepos_formset.forms:
            cafepos.initial = cafepos_init_data

        cafe_form = CafeForm(initial=cafe_init_data)

        context = {
            'cafe_form':cafe_form,
            'cafephoto_formset':cafephoto_formset,
            'cafepos_formset':cafepos_formset
        }

        return render(request, 'main/cafe_form.html', context)