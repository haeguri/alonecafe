from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^profile$', views.profile, name='user_profile'),
    url(r'^login$', 'django.contrib.auth.views.login',
                     {'template_name': 'account/login.html'},
                     name='user_login'),
    url(r'^logout$', 'django.contrib.auth.views.logout', {'next_page':'/'}, name='user_logout')
    # url(r'^cafe/(?P<pk>\d+)/$', views.cafe_detail, name='cafe_detail'),
    # url(r'^cafe/new/$', views.cafe_new, name='cafe_new'),

    # url(r'^accounts/profile', 'authapp.views.profile', name='account_profile'),
    # url(r'^accounts/login', 'django.contrib.auth.views.login',
    #                         {'template_name': 'account/login.html'},
    #                         name='account_login'),
    # url(r'^accounts/logout', 'django.contrib.auth.views.logout', {'next_page':'/'}, name='account_logout'),
]