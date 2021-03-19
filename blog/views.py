from django.shortcuts import render
from django.views.generic import DetailView, ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Content, Post, Podcast
from django.conf import settings
from django.utils import timezone

class ContentList(ListView):
    model = Content
    template_name = "blog/content_list.html"
    paginate_by = 5

    def get_queryset(self):
        return Content.objects.filter(draft=False, published__lte=timezone.now()).order_by("-published")


class PostList(ListView):
    model = Post
    template_name = "blog/content_list.html"
    paginate_by = 5

    def get_queryset(self):
        return Post.objects.filter(draft=False, published__lte=timezone.now()).order_by("-published", "title")


class PodcastList(ListView):
    model = Podcast
    template_name = "blog/content_list.html"
    paginate_by = 5

    def get_queryset(self):
        return Podcast.objects.filter(draft=False, published__lte=timezone.now()).order_by("-published")


class PostDetail(DetailView):
    model = Post

    def get_queryset(self):
        return Post.objects.filter(published__year=self.kwargs.get("year"), 
            published__month=self.kwargs.get("month"), draft=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["title"] = context["object"].title
        return context


class DraftDetail(LoginRequiredMixin, DetailView):
    model = Post
    raise_exception = True
