from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Restaurant, RestaurantPic, MenuItem, BlogPost, Comment, RestaurantLike, Follows, UserEvent, OwnerEvent, BlogLike
# Register your models here.
admin.site.register(User, UserAdmin)

admin.site.register(Restaurant)
admin.site.register(RestaurantPic)
admin.site.register(MenuItem)
admin.site.register(BlogPost)
admin.site.register(Comment)
admin.site.register(RestaurantLike)
admin.site.register(BlogLike)
admin.site.register(Follows)
admin.site.register(UserEvent)
admin.site.register(OwnerEvent)