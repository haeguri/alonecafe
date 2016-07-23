from django.shortcuts import render
from .models import Cafe

def cafe_list(request):
    cafes = Cafe.objects.all()

    return render(request, 'main/cafe_list.html', {'cafes': cafes})

def cafe_detail(request, pk):
    cafe = Cafe.objects.get(pk=pk)

    return render(request, 'main/cafe_detail.html', {'cafe': cafe})