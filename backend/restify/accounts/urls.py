from django.urls import path
from . import views

app_name="accounts"
urlpatterns = [ 
    path('signup/', views.UserCreate.as_view(), name='signup'), 
    path('edit/', views.ProfileUpdate.as_view(), name='profile-edit'), 
    path('login/', views.UserLoginView.as_view(), name='login'), 
    path('logout/', views.UserLogoutView.as_view(), name='logout'), 
    path('user/', views.UserInfoView.as_view(), name='user'), 
] 