from django import forms

from .models import Cafe, CafePhoto, CafePosition, Region

TOGGLE_HIDDEN_FIELDS = ('week_hours', 'satur_hours', 'sun_hours')

class CafePhotoForm(forms.ModelForm):

    class Meta:
        model = CafePhoto
        fields = '__all__'

class CafePositionForm(forms.ModelForm):

    class Meta:
        model = CafePosition
        exclude = ('', )

class CafeForm(forms.ModelForm):
    # name = forms.CharField(label='카페이름', widget=forms.TextInput(attrs={'class':'form-control'}))
    intro = forms.CharField(label='카페소개', max_length=500, widget=forms.Textarea())
    # address = forms.CharField(label='간략한 주소', max_length=10, widget=forms.TextInput(attrs=({'class':'form-control'})))
    # mood = forms.CharField(label='분위기', max_length=10, widget=forms.TextInput(attrs=({'class':'form-control'})))

    class Meta:
        model = Cafe
        exclude = ('created',)