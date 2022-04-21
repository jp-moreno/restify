from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class User(AbstractUser):
    pic = models.ImageField(upload_to="profile_pics", default="default_profile_pic.jpg")
    phonenumber = models.CharField(max_length=50)
    class Meta:
        ordering = ["-date_joined"]


class Restaurant(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) 
    logo = models.ImageField(upload_to="logos", default="default_logo.jpg")
    primarypic = models.ImageField(upload_to="primary", default="placeholder.jpg")
    name = models.CharField(max_length=100)
    desc = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    postalcode = models.CharField(max_length=15)
    phonenumber = models.CharField(max_length=50)
    likes = models.IntegerField(default=0)
    followers = models.IntegerField(default=0)
    time = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-time"]

    def __str__(self):
        return self.name

class RestaurantPic(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    pic = models.ImageField()
    priority = models.IntegerField()
    class Meta:
        ordering = ["-priority"]


class UserEvent(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    time = models.DateTimeField(auto_now=True)
    etype = models.CharField(max_length=10)

class MenuItem(UserEvent):
    desc = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"${self.price} {self.name} {self.desc}"

class BlogPost(UserEvent):
    text = models.CharField(max_length=5000)
    likes = models.IntegerField(default=0)

class OwnerEvent(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now=True)
    etype = models.CharField(max_length=10)

class Comment(OwnerEvent):
    text = models.CharField(max_length=500)

class RestaurantLike(OwnerEvent):
    pass

class BlogLike(OwnerEvent):
    blog = models.ForeignKey(BlogPost, on_delete=models.CASCADE)


class Follows(OwnerEvent):
    pass
