from django.urls import path
from . import views

app_name="notifs"
urlpatterns = [ 
    path('view/', views.NotifsView.as_view(), name='notifs-viewall'), 
    path('<int:pk>/read/', views.NotifRead.as_view(), name='notif-read'), 
    path('<int:pk>/clear/', views.NotifDelete.as_view(), name='notif-clear'), 
    path('unread/', views.NotifUnread.as_view(), name='notif-unread'), 
] 