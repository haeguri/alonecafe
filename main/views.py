from django.shortcuts import render
from .models import *
from .forms import *

def cafe_list(request):
    cafes = Cafe.objects.all()

    return render(request, 'main/cafe_list.html', {'cafes': cafes})

def cafe_detail(request, pk):
    cafe = Cafe.objects.get(pk=pk)

    return render(request, 'main/cafe_detail.html', {'cafe': cafe})

def cafe_new(request):

    if request.method == 'POST':
        pass
    else:
        cafe_form = CafeForm()
        cafephoto_form = CafePhotoForm()
        cafepos_form = CafePositionForm()

        context = {
            'cafe_form':cafe_form,
            'cafephoto_form':cafephoto_form,
            'cafepos_form':cafepos_form
        }

        return render(request, 'main/cafe_form.html', context)
