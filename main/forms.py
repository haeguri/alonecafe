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
    intro = forms.CharField(label='간단한 소개 *', max_length=500, widget=forms.Textarea(attrs={'class':'materialize-textarea'}))
    has_solo_table = forms.BooleanField(label='1인 테이블 *', widget=forms.CheckboxInput(attrs={'class':'check-input'}))

    class Meta:
        model = Cafe
        exclude = ('created',)
        labels = {
            'region': '지역',
            'name': '카페 이름 *',
            'address': '간략한 주소 *',
            'mood': '분위기 *'
            # 'intro': '간단한 소개 *'
        }

    def __init__(self, *args, **kwargs):
        super(CafeForm, self).__init__(*args, **kwargs)
        self.required_css_class = 'required'