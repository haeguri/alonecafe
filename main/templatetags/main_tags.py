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