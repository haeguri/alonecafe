from django import forms

from .models import Cafe, CafePhoto, CafePosition, Region

class CafePhotoForm(forms.ModelForm):

    class Meta:
        model = CafePhoto
        fields = '__all__'
        labels = {
            'image':''
        }

class CafePositionForm(forms.ModelForm):

    class Meta:
        model = CafePosition
        fields = '__all__'

class CafeForm(forms.ModelForm):
    intro = forms.CharField(label='카페 소개', max_length=500, widget=forms.Textarea(), error_messages={'required':'카페 소개'})

    class Meta:
        model = Cafe
        exclude = ('created',)
        error_messages = {
            'name': {
                'required': '카페 이름'
            },
            'address': {
                'required': '위치'
            }
        }