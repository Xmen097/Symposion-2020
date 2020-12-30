from django import template

register = template.Library()


@register.simple_tag
def verbose_name(obj):
    return obj._meta.verbose_name


@register.simple_tag
def verbose_name_plural(obj):
    return obj._meta.verbose_name_plural
