from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.cafe_list, name='cafe_list'),
    url(r'^cafe/(?P<pk>\d+)/$', views.cafe_detail, name='cafe_detail'),
]