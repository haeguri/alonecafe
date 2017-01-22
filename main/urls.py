from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.cafe_list, name='cafe_list'),
    url(r'^cafe/(?P<pk>\d+)/$', views.cafe_detail, name='cafe_detail'),
    url(r'^cafe/new/$', views.cafe_new, name='cafe_new'),
    url(r'^cafe/(?P<pk>\d+)/edit/$', views.cafe_edit, name='cafe_edit'),
    url(r'^cafe/(?P<pk>\d+)/delete/$', views.cafe_delete, name='cafe_delete'),
    # /cafe/_id_/delete/
]