from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.urls import reverse
import bleach
import markdown


class Content(models.Model):
    published = models.DateTimeField(null=True, blank=True, verbose_name="Uveřejněno")
    draft = models.BooleanField(verbose_name="Je koncept?")


class Post(Content):
    title = models.CharField(max_length=256, verbose_name="Titulek")
    author = models.CharField(max_length=256, verbose_name="Autor", blank=True)
    content = models.TextField(verbose_name="Obsah")

    modified = models.DateTimeField(null=True, blank=True, verbose_name="Upraveno")

    markdown = models.BooleanField(verbose_name="Používá Markdown?", default=False)

    slug = models.SlugField()

    def save(self, *args, **kwargs):
        if self.content and not self.markdown:
            self.content = bleach.clean(self.content, strip=True, tags=["b", "i", "p", "u", "img", "video", "ul", "ol", "li", "blockquote", "q"])
        self.slug = slugify(self.title)
        return super().save(*args, **kwargs)

    @property
    def html(self):
        if self.markdown:
            return markdown.markdown(self.content)
        return self.content

    def get_absolute_url(self):
        if self.published:
            return reverse("blog.post", args=(self.published.year, self.published.month, self.slug))
        elif self.draft:
            return reverse("blog.draft", args=(self.slug,))
        return ""

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Článek"
        verbose_name_plural = "Články"


class Podcast(Content):
    embed = models.TextField(verbose_name="Vkládací kód")

    class Meta:
        verbose_name = "Podcast"
        verbose_name_plural = "Podcasty"


class Setting(models.Model):
    name = models.CharField(max_length=256, verbose_name="Jméno k zobrazení")
    key = models.CharField(max_length=256, verbose_name="Klíč", unique=True)
    value = models.TextField(verbose_name="Hodnota", blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Nastavení"
        verbose_name_plural = "Nastavení"
