from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.urls import reverse
import markdown


class Section(models.Model):
    title = models.CharField(max_length=256, verbose_name="Nadpis")
    content = models.TextField(verbose_name="Obsah")
    order = models.PositiveSmallIntegerField(verbose_name="Pořadové číslo")

    markdown = models.BooleanField(verbose_name="Používá Markdown?", default=False)
    slug = models.SlugField()

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        return super().save(*args, **kwargs)

    @property
    def html(self):
        if self.markdown:
            return markdown.markdown(self.content)
        return self.content

    def get_absolute_url(self):
        return reverse("blog.info") + "#" + self.slug

    class Meta:
        verbose_name = "Sekce"
        verbose_name_plural = "Sekce"


class Post(models.Model):
    title = models.CharField(max_length=256, verbose_name="Titulek")
    author = models.CharField(max_length=256, verbose_name="Autor", blank=True)
    content = models.TextField(verbose_name="Obsah")

    published = models.DateTimeField(null=True, blank=True, verbose_name="Uveřejněno")
    modified = models.DateTimeField(null=True, blank=True, verbose_name="Upraveno")

    draft = models.BooleanField(verbose_name="Je koncept?")
    markdown = models.BooleanField(verbose_name="Používá Markdown?", default=False)

    slug = models.SlugField()

    def save(self, *args, **kwargs):
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


class Podcast(models.Model):
    embed = models.TextField(verbose_name="Vkládací kód")
    published = models.DateTimeField(blank=True, verbose_name="Uveřejněno")

    class Meta:
        verbose_name = "Podcast"
        verbose_name_plural = "Podcasty"
