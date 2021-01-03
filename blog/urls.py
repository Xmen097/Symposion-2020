from django.urls import path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
	path('', TemplateView.as_view(template_name="index.html"), name="index"),
	path('blog/', views.ContentList.as_view(), name="blog.all"),
	path('blog/posts/', views.PostList.as_view(), name="blog.posts"),
	path('blog/podcasts/', views.PodcastList.as_view(), name="blog.podcasts"),
	path('blog/post/<int:year>/<int:month>/<slug:slug>/', views.PostDetail.as_view(), name="blog.post"),
	path('blog/draft/<slug:slug>/', views.DraftDetail.as_view(), name="blog.draft"),
]
