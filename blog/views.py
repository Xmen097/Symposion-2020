from django.shortcuts import render
from django.views.generic import DetailView, ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Content, Post, Podcast
from django.conf import settings


class ContentList(ListView):
    model = Content
    template_name = "content_list.html"
    queryset = Content.objects.filter(draft=False).order_by("-published")
    paginate_by = 10


class PostList(ListView):
    model = Post
    template_name = "content_list.html"
    queryset = Post.objects.filter(draft=False).order_by("-published", "title")
    paginate_by = 10


class PodcastList(ListView):
    model = Podcast
    template_name = "content_list.html"
    queryset = Podcast.objects.filter(draft=False).order_by("-published")
    paginate_by = 10


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
