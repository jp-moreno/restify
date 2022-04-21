from rest_framework import serializers
from .models import User, Restaurant, RestaurantPic, MenuItem, BlogPost, Comment, RestaurantLike, Follows, UserEvent, OwnerEvent

class UserSerialiazer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "first_name", "last_name", "phonenumber", "pic"]
        extra_kwargs = {
            "id": {"read_only": True},
            "password": {"write_only": True},
        }

    # https://stackoverflow.com/questions/27586095/why-isnt-my-django-user-models-password-hashed hasing password properly
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class RestaurantSerializer(serializers.HyperlinkedModelSerializer):
    owner = UserSerialiazer(required=False)
    class Meta:
        model = Restaurant
        fields = ["id", "owner", "name", "desc", "address", "postalcode", "phonenumber", "likes", "followers", "logo", "primarypic"]
        extra_kwargs = {
            "id": {"read_only": True},
            "likes": {"read_only": True},
            "followers": {"read_only": True},
        }

class RestaurantPicSerializer(serializers.HyperlinkedModelSerializer):
    pic = serializers.ImageField(required=False)
    class Meta:
        model = RestaurantPic
        fields = ["priority", "pic", "id"]
        extra_kwargs = {
            "id":{"read_only": True},
        }

class BlogPostSerializer(serializers.HyperlinkedModelSerializer):
    restaurant = RestaurantSerializer(required=False)
    etype = serializers.CharField(max_length=10, required=False)
    class Meta:
        model = BlogPost
        fields = ["id", "name", "restaurant", "text", "etype", "likes"]
        extra_kwargs = {
            "restaurant": {"read_only": True},
            "likes": {"read_only": True},
        }

class PreviewBlogPostSerializer(serializers.HyperlinkedModelSerializer):
    restaurant = RestaurantSerializer(required=False)
    class Meta:
        model = BlogPost
        fields = ["id", "name", "restaurant"]
        extra_kwargs = {
            "restaurant": {"read_only": True},
        }

class MenuItemSerializer(serializers.HyperlinkedModelSerializer):
    etype = serializers.CharField(max_length=10, required=False)
    class Meta:
        model = MenuItem
        fields = ["name", "desc", "price", "etype", "id"]
        extra_kwargs = {
            "id":{"read_only": True},
        }

class CommentSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerialiazer(required=False)
    etype = serializers.CharField(max_length=10, required=False)
    class Meta:
        model = Comment
        fields = ["id", "time", "user", "text", "etype"]
        extra_kwargs = {
            "id":{"read_only": True},
            "user":{"read_only": True},
            "time":{"read_only": True},
        }


class RestaurantLikeSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerialiazer(required=False)
    restaurant = RestaurantSerializer(required=False)
    etype = serializers.CharField(max_length=10, required=False)
    class Meta:
        model = RestaurantLike
        fields = ["user", "restaurant", "etype"]

class BlogLikeSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerialiazer(required=False)
    blog = RestaurantSerializer(required=False)
    etype = serializers.CharField(max_length=10, required=False)
    class Meta:
        model = RestaurantLike
        fields = ["user", "blog", "etype"]


class FollowsSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerialiazer(required=False)
    restaurant = RestaurantSerializer(required=False)
    etype = serializers.CharField(max_length=10, required=False)
    class Meta:
        model = Follows
        fields = ["user", "restaurant", "etype"]

class UserEventSerializer(serializers.HyperlinkedModelSerializer):
    restaurant = RestaurantSerializer(required=False)
    class Meta:
        model = UserEvent
        fields = ["etype", "restaurant", "name", "time"]

class OwnerEventSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerialiazer(required=False)
    restaurant = RestaurantSerializer(required=False)
    class Meta:
        model = OwnerEvent
        fields = ["etype", "user", "restaurant"]