from django.contrib import admin
from django.utils import timezone
from django_summernote.admin import SummernoteModelAdmin
from . import models


class PostAdmin(SummernoteModelAdmin):
    summernote_fields = ("content",)

    fields = (
        "title", "author", 
        "content", "draft", 
        "markdown", "published", 
        "modified",
        )
    list_display = ("title", "published", "modified", "draft", "author")

    def save_model(self, request, obj, form, change):
        if not obj.draft:
            if obj.published:
                obj.modified = timezone.now()
            else:
                obj.published = timezone.now()
        super().save_model(request, obj, form, change)

    class Media:
        js = ("js/editor.js",)


class PodcastAdmin(admin.ModelAdmin):
    fields = ("embed", "published", "draft")
    list_display = ("published", "draft")

    def save_model(self, request, obj, form, change):
        if not obj.published:
            obj.published = timezone.now()
        super().save_model(request, obj, form, change)


admin.site.register(models.Post, PostAdmin)
admin.site.register(models.Podcast, PodcastAdmin)
admin.site.register(models.Setting)