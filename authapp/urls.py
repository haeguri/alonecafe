from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^mypage/$', views.mypage, name="mypage"),
    url(r'^login/?$', 'django.contrib.auth.views.login', name='login', kwargs={'template_name': 'account/login.html'}),
    url(r'^logout/$', 'django.contrib.auth.views.logout', name='logout', kwargs={'next_page':'/'}),
    url(r'^signup/$', views.signup, name='signup'),
]