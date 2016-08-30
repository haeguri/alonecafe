from django import forms

from .models import Cafe, CafePhoto, CafePosition

class CafePhotoForm(forms.ModelForm):
    class Meta:
        model = CafePhoto
        fields = '__all__'

class CafePositionForm(forms.ModelForm):

    class Meta:
        model = CafePosition
        exclude = ('', )

class CafeForm(forms.ModelForm):
    intro = forms.CharField(max_length=500, widget=forms.TextInput(attrs={'class':'materialize-textarea'}))

    class Meta:
        model = Cafe
        exclude = ('created',)
        labels = {
            'name':'카페 이름 *',
            'address':'간략한 주소 *',
            'mood':'분위기 *',
            'intro':'간단한 소개 *'
        }

    def __init__(self, *args, **kwargs):
        super(CafeForm, self).__init__(*args, **kwargs)
        self.required_css_class = 'required'


