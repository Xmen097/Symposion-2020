from django import template
from django.utils.safestring import mark_safe
from blog.models import Setting

register = template.Library()


@register.simple_tag
def verbose_name(obj):
    return obj._meta.verbose_name


@register.simple_tag
def verbose_name_plural(obj):
    return obj._meta.verbose_name_plural

@register.simple_tag()
def config(name):
	try:
		return mark_safe(Setting.objects.get(key=name).value)
	except Setting.DoesNotExist:
		return ""
