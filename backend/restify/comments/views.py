from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView
from .serializers import CommentSerializer
from rest_framework.pagination import PageNumberPagination
from .models import Comment
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from properties.models import Property
from reservations.models import Reservation
from accounts.models import RestifyUser
from django.db.models import Q
from django.db.models import QuerySet



# Create your views here.
class CommentPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class PropertyCommentsListView(ListAPIView): 
    serializer_class = CommentSerializer
    pagination_class = CommentPagination

    def get_queryset(self): 
        object_id = self.kwargs.get('pk')
        ct = ContentType.objects.get_for_model(model=Property)
        comments = Comment.objects.filter(content_type=ct, object_id=object_id)
        return comments
    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data) 
    
    
class UserCommentListView(ListAPIView): 
    serializer_class = CommentSerializer
    pagination_class = CommentPagination

    def get_queryset(self): 
        object_id = self.kwargs.get('pk')
        ct = ContentType.objects.get_for_model(model=RestifyUser)
        comments = Comment.objects.filter(content_type=ct, object_id=object_id)
        return comments
    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data) 
    
class PropertyCommentsAddView(CreateAPIView): 
    permission_classes = [IsAuthenticated]
    serializer_class =  CommentSerializer

    def create(self, request, *args, **kwargs):
        property_id = self.kwargs['pk']
        property = Property.objects.get(pk=property_id)
        serializer = self.get_serializer(data=request.data, context={'property_id': property_id, 'request': request})
        serializer.is_valid(raise_exception=True)
        reservations = Reservation.objects.filter(Q(status='terminated')| Q(status='completed'), guest=request.user, property=property)
        try: 
            latest_comment = Comment.objects.filter(object_id=(property_id)).latest('timestamp')
        except Comment.DoesNotExist: 
            latest_comment = None


        # Propery comments can only be left if: 
         # 3. User is replying to host follow-up
        if reservations.exists() and latest_comment and latest_comment.comment_type=='host-reply': 
            Comment.objects.create(content_object=property, comment_type='user-reply')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # 2. Host is replying to a comment left by user
        if request.user == property.owner and latest_comment and (latest_comment.comment_type=='user-reply' or latest_comment.comment_type=='comment'): 
            Comment.objects.create(content_object=property,  comment_type='host-reply')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # 1. user has completed or terminated reservation and this is their first comment
        if reservations.exists() and (not latest_comment or latest_comment.commentor != request.user) and latest_comment.comment_type != 'host-reply' and latest_comment.comment_type != 'user-reply':
            Comment.objects.create(comment_type='comment', content_object=property, commentor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
        
    
class UserCommentAddView(CreateAPIView): 
    permission_classes = [IsAuthenticated]
    serializer_class =  CommentSerializer

    def create(self, request, *args, **kwargs):
        user_id = self.kwargs['pk']
        person = RestifyUser.objects.get(pk=user_id)
        serializer = self.get_serializer(data=request.data, context={'user_id': user_id, 'request': request})
        serializer.is_valid(raise_exception=True)
        # Propery comments can only be left if: 
        # user was guest and status is completed 
        reservations = Reservation.objects.filter(Q(status='completed')& Q(property__owner=request.user) & Q(guest__id = user_id))
        comments = Comment.objects.filter(Q(object_id = user_id) & Q(commentor = request.user))
        if reservations.exists() and not comments.exists(): 
            Comment.objects.create(content_object=person, comment_type='comment', commentor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)


    