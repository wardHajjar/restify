from django.urls import path
from . import views

app_name="properties"
urlpatterns = [
    path('add/', views.PropertyCreate.as_view(), name='property-add'), 
    path('<int:pk>/update/', views.PropertyUpdate.as_view(), name='property-update'),
    path('<int:pk>/view/', views.PropertyView.as_view(), name='property-view'), 
    path('<int:pk>/delete/', views.PropertyDelete.as_view(), name='property-delete'), 
    path('search/', views.PropertyListRead.as_view(), name='search'),

] 