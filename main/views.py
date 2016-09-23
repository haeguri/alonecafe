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
    cafes = Cafe.objects.all()

    return render(request, 'main/cafe_list.html', {'cafes': cafes})

def cafe_detail(request, pk):
    cafe = Cafe.objects.get(pk=pk)

    return render(request, 'main/cafe_detail.html', {'cafe': cafe})

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

        for cafephoto in cafephoto_formset:
            print("Cafephoto is ", type(cafephoto))

        for cafepos in cafepos_formset.forms:
            cafepos.initial = cafepos_init_data

        cafe_form = CafeForm(initial=cafe_init_data)

        context = {
            'cafe_form':cafe_form,
            'cafephoto_formset':cafephoto_formset,
            'cafepos_formset':cafepos_formset
        }

        return render(request, 'main/cafe_form.html', context)