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
    region = forms.ModelChoiceField(label='지역', queryset=Region.objects.all(), widget=forms.Select(attrs={'class':'form-control'}))
    name = forms.CharField(label='카페이름', widget=forms.TextInput(attrs={'class':'form-control'}))
    intro = forms.CharField(label='카페소개', max_length=500, widget=forms.Textarea(attrs={'class':'form-control'}))
    has_solo_table = forms.BooleanField(label='1인좌석 여부', widget=forms.CheckboxInput(attrs={'class':'form-control checkbox'}))
    week_hours  = forms.CharField(label='평일 영업시간', required=False, widget=forms.TextInput(attrs=({'class':'form-control'})))
    satur_hours  = forms.CharField(label='토요일 영업시간', required=False, widget=forms.TextInput(attrs=({'class':'form-control'})))
    sun_hours  = forms.CharField(label='일요일 영업시간', required=False, widget=forms.TextInput(attrs=({'class':'form-control'})))

    class Meta:
        model = Cafe
        exclude = ('created',)

    def required_fields(self):
        return [field for field in self if field.field.required and type(field.field.widget).__name__ != 'CheckboxInput']

    def no_required_fields(self):
        return [field for field in self if not field.field.required]