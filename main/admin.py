from django.contrib import admin
from .models import Region, Cafe, CafePhoto

class CafePhotoInline(admin.TabularInline):
    fields = ('cafe', 'image',)
    model = CafePhoto

class CafeAdmin(admin.ModelAdmin):
    list_display = ('name','id', )
    inlines = (CafePhotoInline,)

admin.site.register(Region)
admin.site.register(Cafe, CafeAdmin)
