from django.urls import path
from . import views

app_name="comments"
urlpatterns = [ 
    path('property/<int:pk>/view/', views.PropertyCommentsListView.as_view(), name='property-comm-viewall'), 
    path('property/<int:pk>/add/', views.PropertyCommentsAddView.as_view(), name='property-comm-add'), 
    path('user/<int:pk>/add/', views.UserCommentAddView.as_view(), name='user-comm-add'), 
    path('user/<int:pk>/view/', views.UserCommentListView.as_view(), name='user-comm-viewall'), 
] 