from django.urls import path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
	path('', TemplateView.as_view(template_name="index.html")),
	path('blog/', views.PostList.as_view(), name="blog.list"),
	path('blog/post/<int:year>/<int:month>/<slug:slug>/', views.PostDetail.as_view(), name="blog.post"),
	path('blog/draft/<slug:slug>/', views.DraftDetail.as_view(), name="blog.draft"),
	path('podcasts/', views.Podcasts.as_view(), name="blog.podcasts")
]
