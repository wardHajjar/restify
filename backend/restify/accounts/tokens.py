from .models import RestifyUser
from rest_framework_simplejwt.tokens import RefreshToken

# from the tutorial: https://github.com/jod35/Building-APIS-with-DRF/blob/main/accounts/tokens.py

User = RestifyUser

def create_jwt_pair_for_user(user: User):
    refresh = RefreshToken.for_user(user)
    tokens = {"access": str(refresh.access_token), "refresh": str(refresh)}
    return tokens