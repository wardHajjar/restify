from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.contenttypes.fields import GenericRelation
from comments.models import Comment 
 

class RestifyUserManager(BaseUserManager): 
    def create_user(self, username, password, **kwargs): 
        user = self.model(
            username=username,
            **kwargs
        )

        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, password, **kwargs):
        kwargs.setdefault("is_staff", True)
        kwargs.setdefault('is_superuser', True)
        
        return self.create_user(username=username, password=password, **kwargs)


class RestifyUser(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    rating = models.FloatField(blank=True, null=True)
    is_host = models.BooleanField(default=False, blank=False, null=False)
    phone = models.PositiveIntegerField(blank=True, null=True)
    profile_pic = models.ImageField(upload_to='images/', blank=True, null=True)
    objects = RestifyUserManager()

    comments = GenericRelation(Comment, related_query_name='users')

    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.username
    
