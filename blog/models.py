from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.urls import reverse
from django.core.files.base import ContentFile
from django_summernote.models import Attachment
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import markdown
import requests
import os
import re


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
            soup = BeautifulSoup(self.content, "html.parser")
            for tag in soup.select("*"):
                if tag.get("style"):
                    tag["style"] = re.sub(r"font-?\w*:\s*.*?;", "", tag["style"])
            for tag in soup.find_all("img"):
                url = tag.get("src")
                if url and not url.startswith("/"):
                    try:
                        res = requests.get(url)
                        if res.ok:
                            att = Attachment(name=os.path.basename(urlparse(url).path)[:50].replace("/", ""))
                            att.file.save(att.name[:20], ContentFile(res.content))
                            att.save()
                            tag["src"] = att.file.url
                    except requests.exceptions.RequestException:
                        pass

                if tag.get("style"):
                    tag["style"] = re.sub(r"margin-?\w*:\s*.*?;", "", tag["style"])

            self.content = str(soup)
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
