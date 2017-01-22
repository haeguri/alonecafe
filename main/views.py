from django.shortcuts import render, redirect
from .forms import *
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponse
import json

def cafe_list(request):
    cafes = Cafe.objects.all().order_by('-created')

    return render(request, 'main/cafe_list.html', {'cafes': cafes})

def cafe_detail(request, pk):
    cafe = Cafe.objects.get(pk=pk)

    response_data = {
        'id':cafe.id,
        'user':cafe.user.id,
        'img_list':[cafe.photo.image.url],
        'name':cafe.name,
        'address':cafe.address,
        'intro':cafe.intro,
        'pos':cafe.position.latitude + "," + cafe.position.longitude
    }

    return HttpResponse(json.dumps(response_data), content_type="application/json", charset="utf-8")

@login_required(login_url=("/auth/login"))
def cafe_edit(request, pk):
    cafe = Cafe.objects.get(id=pk)
    if cafe.user.id != request.user.id:
        return redirect('main:cafe_list')

    context = {}

    if request.method == 'GET':
        cafe_form = CafeForm(initial={'user':request.user.id, 'name':cafe.name, 'intro':cafe.intro, 'address':cafe.address})
        cafephoto_form = CafePhotoForm(initial={'cafe':cafe.id})
        cafepos_form = CafePositionForm(initial={'cafe':cafe.id, 'latitude':cafe.position.latitude, 'longitude':cafe.position.longitude})

        context['cafe_id'] = cafe.id
        context['cafe_form'] = cafe_form
        context['cafephoto_form'] = cafephoto_form
        context['cafepos_form'] = cafepos_form
    elif request.method == 'POST':
        cafe_form = CafeForm(request.POST, instance=cafe)

        if cafe_form.is_valid():
            cafe_form.save()
            cafephoto_form = CafePhotoForm(request.POST, request.FILES, instance=CafePhoto.objects.get(cafe=cafe.id))
            cafepos_form = CafePositionForm(request.POST, instance=CafePosition.objects.get(cafe=cafe.id))

            if cafephoto_form.is_valid() and cafepos_form.is_valid():
                cafephoto_form.save()
                cafepos_form.save()
                return redirect('main:cafe_list')
            else:
                context['cafe_form'] = cafe_form
                if not cafephoto_form.is_valid():
                    cafephoto_form.add_error(None, '이미지를 등록해주세요. ')
                if not cafepos_form.is_valid():
                    cafepos_form.add_error(None, '위치를 다시 확인해주세요.')
                context['cafephoto_form'] = cafephoto_form
                context['cafepos_form'] = cafepos_form
        else:
            cafe_form.add_error(None, '정보를 확인해주세요 !')
            context['cafe_form'] = cafe_form
            context['cafephoto_form'] = CafePhotoForm()
            context['cafepos_form'] = CafePositionForm()

    context['cafe_id'] = cafe.id
    context['cur_img'] = cafe.photo.image.url

    return render(request, 'main/cafe_form.html', context)

@login_required(login_url='/auth/login')
def cafe_delete(request, pk):
    if request.method == 'DELETE':
        cafe = Cafe.objects.get(id=pk)

        if cafe.user.id != request.user.id:
            return HttpResponse("잘못된 접근입니다.")

        cafe.delete()
        response = {
            'next_url':str(reverse_lazy('main:cafe_list'))
        }

        return HttpResponse(json.dumps(response), content_type='application/json')

@login_required(login_url='/auth/login')
def cafe_new(request):
    context = {}
    if request.method == 'GET':
        context['cafe_form'] = CafeForm()
        context['cafephoto_form'] = CafePhotoForm()
        context['cafepos_form'] = CafePositionForm()
    else:
        request.POST['user'] = request.user.id
        cafe_form = CafeForm(request.POST)

        if cafe_form.is_valid():
            new_cafe = cafe_form.save()
            request.POST['cafe'] = new_cafe.id
            cafephoto_form = CafePhotoForm(request.POST, request.FILES)
            cafepos_form = CafePositionForm(request.POST)

            if cafephoto_form.is_valid() and cafepos_form.is_valid():
                cafephoto_form.save()
                cafepos_form.save()
                return redirect('main:cafe_list')
            else:
                context['cafe_form'] = cafe_form
                if not cafephoto_form.is_valid():
                    print("CafePhoto Form is Error..", cafephoto_form.errors)
                    cafephoto_form.add_error(None, '이미지를 등록해주세요 !')
                if not cafepos_form.is_valid():
                    print("CafePosition Form is Error..", cafepos_form.errors)
                    cafepos_form.add_error(None, '위치를 다시 확인해주세요 !')
                context['cafephoto_form'] = cafephoto_form
                context['cafepos_form'] = cafepos_form
        else:
            print("Cafe form is error", cafe_form)
            cafe_form.add_error(None, '정보를 확인해주세요. !')
            context['cafe_form'] = cafe_form
            context['cafephoto_form'] = CafePhotoForm()
            context['cafepos_form'] = CafePositionForm()

    return render(request, 'main/cafe_form.html', context)
