from django import template
import os

register = template.Library()

@register.simple_tag
def get_api_key(service):

    if service == 'GOOGLE_MAP_KEY':
        key = os.environ['GOOGLE_MAP_KEY']
    else:
        key = ''

    return key

@register.inclusion_tag('tags/cafe_detail_tag.html', takes_context=True)
def detail_image(context):
    return {
        'img':context['cafe'].photos.all()[0].image.url,
        'img_list':[photo.image.url for photo in context['cafe'].photos.all()[:]]
    }