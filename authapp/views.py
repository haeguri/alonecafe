from django.shortcuts import render, render_to_response

# Create your views here.

def profile(request):

    return render(request, template_name='account/profile.html', context={})
