from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include
from . import views
from rest_framework.urlpatterns import format_suffix_patterns
from django.conf import settings

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('users/', views.UserView.as_view(), name="users"),
    path('me/', views.MeView.as_view(), name="me"),
    path('my_restaurant/', views.MyRestaurant.as_view(), name="my_restaurant"),
    path('user_pic/', views.UserPicView.as_view(), name="userpic"),
    path('edit_user/', views.EditUserView.as_view(), name="users"),
    path('restaurant/', views.SpecificRestaurantView.as_view(), name="restaurant"),
    path('restaurants/', views.RestaurantView.as_view(), name="restaurants"),
    path('rest_pic/', views.RestPicView.as_view(), name="restaurant_pic"),
    path('logo_pic/', views.RestLogoPicView.as_view(), name="logo_pic"),
    path('blog/', views.SpecificBlogView.as_view(), name="blog"),
    path('blogs/', views.BlogView.as_view(), name="blogs"),
    path('followed_blogs/', views.FollowsBlogView.as_view(), name="followed_blogs"),
    path('menus/', views.MenuView.as_view(), name="menus"),
    path('comments/', views.CommentView.as_view(), name="comments"),
    path('restaurant_likes/', views.RestaurantLikeView.as_view(), name="restaurant_likes"),
    path('follows/', views.FollowView.as_view(), name="follows"),
    path('blog_likes/', views.BlogLikeView.as_view(), name="blog_likes"),
    path('notifications/', views.NotifcationView.as_view(), name="notifications"),
    path('owner_notifications/', views.OwnerNotifcationView.as_view(), name="owner_notifications"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
 
#urlpatterns = format_suffix_patterns(urlpatterns)