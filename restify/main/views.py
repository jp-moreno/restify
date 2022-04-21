from django.shortcuts import render
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.settings import api_settings
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.pagination import LimitOffsetPagination
from .serializers import UserSerialiazer, RestaurantSerializer, BlogPostSerializer, MenuItemSerializer, CommentSerializer, BlogLikeSerializer
from .serializers import RestaurantLikeSerializer, FollowsSerializer, UserEventSerializer, OwnerEventSerializer, RestaurantPicSerializer
from .models import User, Restaurant, RestaurantPic, MenuItem, BlogPost, Comment, RestaurantLike, Follows, UserEvent, OwnerEvent, BlogLike
from itertools import chain

# Pagination stuff from https://stackoverflow.com/a/56205219 

class UserView(APIView, LimitOffsetPagination):
    def get(self, request, format=None):
        users = User.objects.all()
        results = self.paginate_queryset(users, request, view=self)
        serializer = UserSerialiazer(results, many=True)
        return self.get_paginated_response(serializer.data)

    def post(self, request, format=None):
        serializer = UserSerialiazer(data=request.data)
        if "username" in request.data:
            users = User.objects.filter(username=request.data["username"])
            if(users):
                return Response(status=status.HTTP_409_CONFLICT)

        if serializer.is_valid():
            if "pic" in request.FILES:
                serializer.save(pic=request.FILES["pic"])
            else:
                serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserPicView(APIView):
    def post(self, request, format=None):
        user = User.objects.filter(id=request.user.id)
        if(not user):
            return Response(status=status.HTTP_403_FORBIDDEN)
        user = user[0]

        if "pic" not in request.FILES:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user.pic = request.FILES["pic"]
        user.save()
        return Response(status=status.HTTP_200_OK)

class RestPicView(APIView):
    def post(self, request, format=None):
        user = User.objects.filter(id=request.user.id)
        if(not user):
            return Response(status=status.HTTP_403_FORBIDDEN)
        user = user[0]
        rest = Restaurant.objects.filter(owner=user)
        if(not rest):
            return Response(status.HTTP_412_PRECONDITION_FAILED)
        rest = rest[0]

        if "pic" not in request.FILES:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        rest.primarypic = request.FILES["pic"]
        rest.save()
        return Response(status=status.HTTP_200_OK)

class RestLogoPicView(APIView):
    def post(self, request, format=None):
        user = User.objects.filter(id=request.user.id)
        if(not user):
            return Response(status=status.HTTP_403_FORBIDDEN)
        user = user[0]
        rest = Restaurant.objects.filter(owner=user)
        if(not rest):
            return Response(status.HTTP_412_PRECONDITION_FAILED)
        rest = rest[0]

        if "pic" not in request.FILES:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        rest.logo = request.FILES["pic"]
        rest.save()
        return Response(status=status.HTTP_200_OK)



class MeView(APIView):
    #permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        user = User.objects.get(id=request.user.id)
        serializer = UserSerialiazer(user)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

class MyRestaurant(APIView):
    def get(self, request, format=None):
        user = User.objects.get(id=request.user.id)
        rest = Restaurant.objects.filter(owner=user)
        if (not rest):
            return Response(status=status.HTTP_404_NOT_FOUND)
        rest = rest[0]
        serializer = RestaurantSerializer(rest)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class EditUserView(APIView):
    #permission_classes = [IsAuthenticated]
    def patch(self, request, format=None):
        print(request.FILES)
        print(request.data)
        print("A")
        user = User.objects.get(id=request.user.id)
        if "first_name" in request.data:
            user.first_name = request.data["first_name"]
        if "last_name" in request.data:
            user.last_name = request.data["last_name"]
        if "phonenumber" in request.data:
            user.phonenumber = request.data["phonenumber"]
        if "email" in request.data:
            user.email = request.data["email"]
        if "pic" in request.FILES:
            print("B")
            user.pic=request.FILES["pic"]
        return Response(status=status.HTTP_200_OK)


class SpecificRestaurantView(APIView):
    def post(self, request, format=None):
        if "restaurant_id" not in request.data:
            return Response(status=HTTP_400_BAD_REQUEST)
        rests = Restaurant.objects.filter(id=request.data["restaurant_id"])
        if not rests:
            return Response(status=statusHTTP_404_NOT_FOUND)
        rest = rests[0]
        serializer = RestaurantSerializer(rest)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class RestaurantView(APIView, LimitOffsetPagination):
    #permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, format=None):
        rests = Restaurant.objects.all().order_by("-likes")
        # name address foods
        if "search" in request.GET:
            items = rests.filter(userevent__name__icontains=request.GET["search"])
            names = rests.filter(name__icontains=request.GET["search"])
            desc = rests.filter(desc__icontains=request.GET["search"])
            rests = items | names | desc
            rests = rests.distinct()
         
        results = self.paginate_queryset(rests, request, view=self)
        serializer = RestaurantSerializer(results, many=True)
        return self.get_paginated_response(serializer.data)


    def post(self, request, format=None):
        user = User.objects.get(id=request.user.id)
        rest = Restaurant.objects.filter(owner=user)
        # restaurant already exists
        if(rest):
            return Response(status=status.HTTP_409_CONFLICT)
        serializer = RestaurantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=user)
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, format=None):
        user = User.objects.get(id=request.user.id)
        rest = Restaurant.objects.filter(owner=user)
        # restaurant doesnt exists
        if(not rest):
            return Response(status=status.HTTP_409_CONFLICT)

        rest = rest[0]
        if "name" in request.data:
            rest.name = request.data["name"]
        if "desc" in request.data:
            rest.desc = request.data["desc"]
        if "address" in request.data:
            rest.address = request.data["address"]
        if "postalcode" in request.data:
            rest.postalcode = request.data["postalcode"]
        if "phonenumber" in request.data:
            rest.phonenumber = request.data["phonenumber"]


        rest.save()
        return Response(status=status.HTTP_200_OK)
         

    def delete(self, request, format=None):
        user = User.objects.get(id=request.user.id)
        rest = Restaurant.objects.filter(owner=user)
        # cant delete restaurant that doesnt exists
        if(not rest):
            return Response(status=status.HTTP_409_CONFLICT)
        rest = rest[0]
        rest.delete() 
        return Response(status=status.HTTP_200_OK)
        
 

#MenuItem
class MenuView(APIView, LimitOffsetPagination):
    #permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request, format=None):
        # gets menuitems by a specific restaurant
        if not "restaurant_id" in request.GET:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if "restaurant_id" in request.GET:
            rest = Restaurant.objects.filter(id=request.GET["restaurant_id"])

        if(not rest):
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)
        rest = rest[0]

        items = MenuItem.objects.filter(restaurant=rest)
        results = self.paginate_queryset(items, request, view=self)
        serializer = MenuItemSerializer(results, many=True)
        return self.get_paginated_response(serializer.data)

    def post(self, request, format=None):
        user = User.objects.get(id=request.user.id)
        rest = Restaurant.objects.filter(owner=user)

        # cannot add to menu if you do not have a restaurant 
        if(not rest):
            return Response(status=HTTP_412_PRECONDITION_FAILED)
        rest = rest[0]
        serializer = MenuItemSerializer(data=request.data)
        if serializer.is_valid():
            print("A")
            serializer.save(restaurant=rest, etype="menuitem")
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        if "item_id" not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(id=request.user.id)
        rest = Restaurant.objects.filter(owner=user)
        # cant delete restaurant that doesnt exists
        if(not rest):
            return Response(status=status.HTTP_409_CONFLICT)
        rest = rest[0]
        items = MenuItem.objects.filter(restaurant=rest, id=request.data["item_id"])
        # cant delete pic that doesnt exist
        if(not items):
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)
        item = items[0]
        item.delete()
        return Response(status=status.HTTP_200_OK)



class SpecificBlogView(APIView):
    def get(self, request, format=None):
        blogs = BlogPost.objects.all()
        # gets a specific blog
        if "blog_id" not in request.GET:
            return Response(status=HTTP_400_BAD_REQUEST)
        
        blog_id = request.GET["blog_id"]
        blogs = blogs.filter(id=blog_id)
        if(not blogs):
            return Response(status=HTTP_404_NOT_FOUND)

        blog = blogs[0]

        serializer = BlogPostSerializer(blog)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

class FollowsBlogView(APIView, LimitOffsetPagination):
    def get(self, request, format=None):
        user = User.objects.get(id=request.user.id)
        followed = Follows.objects.filter(user=user)
        rests = set()
        for f in followed.select_related("restaurant"):
            rests.add(f.restaurant.id)

        rests = list(rests)

        blogs = BlogPost.objects.filter(restaurant__in=rests)
        blogs = blogs.order_by("-time")
        results = self.paginate_queryset(blogs, request, view=self)
        serializer = BlogPostSerializer(results, many=True)
        return self.get_paginated_response(serializer.data)

class NotifcationView(APIView, LimitOffsetPagination):
    def get(self, request, format=None):
        user = User.objects.get(id=request.user.id)
        followed = Follows.objects.filter(user=user)
        rests = set()
        for f in followed.select_related("restaurant"):
            rests.add(f.restaurant.id)

        rests = list(rests)
        userevents = UserEvent.objects.filter(restaurant__in=rests).order_by("-time")
        results = self.paginate_queryset(userevents, request, view=self)
        serializer = UserEventSerializer(results, many=True)
        return self.get_paginated_response(serializer.data)

class OwnerNotifcationView(APIView, LimitOffsetPagination):
    def get(self, request, format=None):
        user = User.objects.get(id=request.user.id)
        rest = Restaurant.objects.filter(owner=user)
        # cannot make blog post if you do not have a restaurant 
        if(not rest):
            return Response(status=HTTP_412_PRECONDITION_FAILED)
        rest = rest[0]

        ownerEvents = OwnerEvent.objects.filter(restaurant=rest).order_by("-time")

        results = self.paginate_queryset(ownerEvents, request, view=self)

        serializer = OwnerEventSerializer(results, many=True)
        return self.get_paginated_response(serializer.data)


#BlogPost
class BlogView(APIView, LimitOffsetPagination):
    #permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, format=None):
        blogs = BlogPost.objects.all()
        # gets a specific blog
        if "blog_id" in request.GET:
            blog_id = request.GET["blog_id"]
            blogs.filter(id=blog_id)
        # gets blogs by a specific restaurant
        if "restaurant_id" in request.GET:
            rest = Restaurant.objects.filter(id=request.GET["restaurant_id"])
            if(not rest):
                return Response(status=status.HTTP_412_PRECONDITION_FAILED)
            rest = rest[0]
            blogs = blogs.filter(restaurant=rest)
            res_id = request.GET["restaurant_id"]

        blogs = blogs.order_by("-time")
        results = self.paginate_queryset(blogs, request, view=self)
        serializer = BlogPostSerializer(results, many=True)
        return self.get_paginated_response(serializer.data)


    def post(self, request, format=None):
        user = User.objects.get(id=request.user.id)
        rest = Restaurant.objects.filter(owner=user)
        # cannot make blog post if you do not have a restaurant 
        if(not rest):
            return Response(status=HTTP_412_PRECONDITION_FAILED)
        rest = rest[0]
        serializer = BlogPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(restaurant=rest, etype="blogpost")
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        if "blog_id" not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(id=request.user.id)
        rest = Restaurant.objects.filter(owner=user)
        # cant delete blog posts from restaurant that doesnt exists
        if(not rest):
            return Response(status=status.HTTP_409_CONFLICT)
        rest = rest[0]
        blog = BlogPost.objects.filter(restaurant=rest, id=request.data["blog_id"])
        if(not blog):
            return Response(status=status.HTTP_409_CONFLICT)
        blog.delete() 
        return Response(status=status.HTTP_200_OK)
 

#Comment
class CommentView(APIView, LimitOffsetPagination):
    #permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request, format=None):
        user, rest = False, False

        if "restaurant_id" in request.GET:
            rest = Restaurant.objects.filter(id=request.GET["restaurant_id"])
            # restaurant not found
            if(not rest):
                return Response(status=status.HTTP_412_PRECONDITION_FAILED)
            rest = rest[0]
    
        if "user_id" in request.GET:
            user = User.objects.filter(id=request.GET["user_id"])
            # user not found
            if (not user):
                return Response(status=status.HTTP_412_PRECONDITION_FAILED)
            user = user[0]

        comments = Comment.objects.all()
        if(user):
            commnets = comments.filter(user=user)
        if(rest):
            print("filtering")
            comments = comments.filter(restaurant=rest)
        

        comments = comments.order_by("-time")

        results = self.paginate_queryset(comments, request, view=self)
        serializer = CommentSerializer(results, many=True)
        return self.get_paginated_response(serializer.data)

    def post(self, request, format=None):
        user = User.objects.get(id=request.user.id)

        # gets resteraunt the comment is on
        if not "restaurant_id" in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if "restaurant_id" in request.data:
            rest = Restaurant.objects.filter(id=request.data["restaurant_id"])

        # cannot comment on restaurant that does not exist
        if(not rest):
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)

        rest = rest[0]
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(restaurant=rest, user=user, etype="comment")
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BlogLikeView(APIView, LimitOffsetPagination):
    #permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request, format=None):
        user = User.objects.get(id=request.user.id)

        if "blog_id" not in request.GET:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        blogs = BlogPost.objects.filter(id=request.GET["blog_id"])
        # restaurant not found
        if(not blogs):
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)
        blog = blogs[0]


        likes = BlogLike.objects.all()
        likes = likes.filter(user=user)
        likes = likes.filter(blog=blog)
        if not likes:
            return Response(status=status.HTTP_404_NOT_FOUND)
        like = likes[0]
        return Response(status=status.HTTP_200_OK)

    def post(self, request, format=None):
        user = User.objects.get(id=request.user.id)

        # gets resteraunt the user is liking
        if not "blog_id" in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        blogs = BlogPost.objects.filter(id=request.data["blog_id"])

        # cannot like a restaurant that does not exist
        if(not blogs):
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)

        blog = blogs[0]
        like = BlogLike.objects.filter(blog=blog, user=user)
        # already liked
        if(like):
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)
        blog.likes = blog.likes + 1
        blog.save()
        blike = BlogLike(blog=blog, user=user, restaurant=blog.restaurant, etype="blike")
        blike.save()
        return Response(status=status.HTTP_201_CREATED)

    def delete(self, request, format=None):
        user = User.objects.get(id=request.user.id)

        # gets resteraunt the user is liking
        if not "blog_id" in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        blogs = BlogPost.objects.filter(id=request.data["blog_id"])

        # cannot like a restaurant that does not exist
        if(not blogs):
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)

        blog = blogs[0]
        like = BlogLike.objects.filter(blog=blog, user=user)
        # already liked
        if(not like):
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)
        blog.likes = blog.likes - 1
        blog.save()
        like.delete()
        return Response(status=status.HTTP_200_OK)


#RestaurantLike
class RestaurantLikeView(APIView, LimitOffsetPagination):
    #permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request, format=None):
        user = User.objects.get(id=request.user.id)

        if "restaurant_id" not in request.GET:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        rest = Restaurant.objects.filter(id=request.GET["restaurant_id"])
        # restaurant not found
        if(not rest):
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)
        rest = rest[0]


        likes = RestaurantLike.objects.all()
        likes = likes.filter(user=user)
        likes = likes.filter(restaurant=rest)
        if not likes:
            return Response(status=status.HTTP_404_NOT_FOUND)
        like = likes[0]
        serializer = RestaurantLikeSerializer(like)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        user = User.objects.get(id=request.user.id)

        # gets resteraunt the user is liking
        if not "restaurant_id" in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if "restaurant_id" in request.data:
            rest = Restaurant.objects.filter(id=request.data["restaurant_id"])

        # cannot like a restaurant that does not exist
        if(not rest):
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)

        rest = rest[0]
        serializer = RestaurantLikeSerializer(data=request.POST)
        if serializer.is_valid():
            like = RestaurantLike.objects.filter(restaurant=rest, user=user)
            # already liked
            if(like):
                return Response(status=status.HTTP_412_PRECONDITION_FAILED)
            rest.likes = rest.likes + 1
            rest.save()
            serializer.save(restaurant=rest, user=user, etype="like")
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        user = User.objects.get(id=request.user.id)
        # gets resteraunt the user is liking
        if not "restaurant_id" in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if "restaurant_id" in request.data:
            rest = Restaurant.objects.filter(id=request.data["restaurant_id"])

        # cannot like a restaurant that does not exist
        if(not rest):
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)

        rest = rest[0]
        like = RestaurantLike.objects.filter(restaurant=rest, user=user)
        # already liked
        if(not like):
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)

        rest.likes = rest.likes - 1
        rest.save()

        like.delete()
        return Response(status=status.HTTP_200_OK)
        
    

#Follows
class FollowView(APIView, LimitOffsetPagination):
    def get(self, request, format=None):
        user = User.objects.get(id=request.user.id)
        if "restaurant_id" not in request.GET:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        rest = Restaurant.objects.filter(id=request.GET["restaurant_id"])

        if(not rest):
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)
        rest = rest[0]

        followers = Follows.objects.all()
        followers = followers.filter(user=user)
        followers = followers.filter(restaurant=rest)
        if not followers:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        follower = followers[0]
        serializer = FollowsSerializer(follower)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        user = User.objects.get(id=request.user.id)

        # gets resteraunt the user is following 
        if not "restaurant_id" in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        rest = Restaurant.objects.filter(id=request.data["restaurant_id"])

        # cannot follow a restaurant that does not exist
        if(not rest):
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)

        rest = rest[0]
        serializer = FollowsSerializer(data=request.data)
        if serializer.is_valid():
            follow = Follows.objects.filter(restaurant=rest, user=user, etype="follow")
            # already liked
            if(follow):
                return Response(status=status.HTTP_412_PRECONDITION_FAILED)
            rest.followers = rest.followers + 1
            rest.save()
            serializer.save(restaurant=rest, user=user, etype="follow")
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        user = User.objects.get(id=request.user.id)
        # gets resteraunt the user is liking
        if not "restaurant_id" in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if "restaurant_id" in request.data:
            rest = Restaurant.objects.filter(id=request.data["restaurant_id"])

        # cannot like a restaurant that does not exist
        if(not rest):
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)

        rest = rest[0]
        follow = Follows.objects.filter(restaurant=rest, user=user)
        # already liked
        if(not follow):
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)
        rest.followers = rest.followers - 1
        rest.save()
        follow.delete()
        return Response(status=status.HTTP_200_OK)
  
