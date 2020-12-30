from django.urls import path
from . import views

urlpatterns = [
	path('', views.SectionList.as_view(), name="blog.info"),
	path('blog/', views.PostList.as_view(), name="blog.list"),
	path('blog/post/<int:year>/<int:month>/<slug:slug>/', views.PostDetail.as_view(), name="blog.post"),
	path('blog/draft/<slug:slug>/', views.DraftDetail.as_view(), name="blog.draft"),
]
