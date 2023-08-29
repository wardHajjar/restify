from django.contrib.auth.backends import BaseBackend
from .models import RestifyUser

class RestifyUserBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None,  **kwargs):
        try:
            user = RestifyUser.objects.get(username=username, password=password)
        except RestifyUser.DoesNotExist:
            return None
        return user 

    def get_user(self, user_id):
        try:
            return RestifyUser.objects.get(pk=user_id)
        except RestifyUser.DoesNotExist:
            return None