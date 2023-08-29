from django.shortcuts import render
from rest_framework.generics import CreateAPIView, \
    ListAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.views import APIView
from .serializers import UserSerializer, ProfileSerializer, UserLoginSerializer 
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .tokens import create_jwt_pair_for_user
from rest_framework import status
from .models import RestifyUser
from django.http import JsonResponse

# Create your views here.

class UserCreate(CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class ProfileUpdate(UpdateAPIView): 
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer  
    
    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        obj = queryset.get(pk=self.request.user.id)
        return obj
    
    def get_queryset(self):
        return RestifyUser.objects.filter(username=self.request.user.username)

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(instance=self.get_object(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class UserLoginView(APIView): 
    serializer_class = UserLoginSerializer 
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is not None:
            tokens = create_jwt_pair_for_user(user)

            response = {"message": "Login Successfull", "tokens": tokens}
            return Response(data=response, status=status.HTTP_200_OK)

        else:
            return Response(data={"message": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

class UserLogoutView(APIView): 
    permission_classes = [IsAuthenticated]
    def post(self, request): 
        response = {"message": "Logout Successfull"}
        return Response(data=response, status=status.HTTP_200_OK)  
    
class UserInfoView(APIView): 
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        user = request.user
        user_info = {
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'phone': user.phone, 
            'profile_pic': user.profile_pic if user.profile_pic else None,
            'pk': user.pk
        }
        return Response(data=user_info)