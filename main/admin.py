from django.contrib import admin
from .models import *

class CafePhotoInline(admin.TabularInline):
    fields = ('cafe', 'image',)
    model = CafePhoto

class CafePositionInline(admin.TabularInline):
    fields = ('cafe', 'longitude', 'latitude')
    model = CafePosition

class CafeAdmin(admin.ModelAdmin):
    list_display = ('name','id', 'address', 'intro')
    inlines = (CafePhotoInline,CafePositionInline)

admin.site.register(Region)
admin.site.register(Cafe, CafeAdmin)