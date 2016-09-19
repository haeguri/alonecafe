from django import forms

from .models import Cafe, CafePhoto, CafePosition

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
    intro = forms.CharField(label='간단한 소개 *', max_length=500, widget=forms.Textarea(attrs={'class':'materialize-textarea'}))
    has_solo_table = forms.BooleanField(label='1인 테이블 *', widget=forms.CheckboxInput(attrs={'class':'check-input'}))
    week_hours  = forms.CharField(label='평일 영업시간', required=False, widget=forms.TextInput(attrs=({'class':'toggle_hidden'})))
    satur_hours  = forms.CharField(label='토요일 영업시간', required=False, widget=forms.TextInput(attrs=({'class':'toggle_hidden'})))
    sun_hours  = forms.CharField(label='주말 영업시간', required=False, widget=forms.TextInput(attrs=({'class':'toggle_hidden'})))

    class Meta:
        model = Cafe
        exclude = ('created',)
        labels = {
            'region': '지역',
            'name': '카페 이름 *',
            'address': '간략한 주소 *',
            'mood': '분위기 *'
        }

    def __init__(self, *args, **kwargs):
        super(CafeForm, self).__init__(*args, **kwargs)
        self.required_css_class = 'required'

    def main_fields(self):
        # fields = []
        # for field in self:
        #     if field.field.widget.attrs.get('class') != 'toggle_hidden':


        return [field for field in self if field.field.widget.attrs.get('class') != 'toggle_hidden']
        # return fields

    def toggle_hidden_fields(self):
        # fields = []
        # for field in self:
        #     if field.field.widget.attrs.get('class') == 'toggle_hidden':
        #         fields += field
        #         print("toggle_hidden_fields is ", field)

        return [field for field in self if field.field.widget.attrs.get('class') == 'toggle_hidden']
        # return fields