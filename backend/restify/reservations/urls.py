from django.urls import path
from . import views

app_name="reservations"
urlpatterns = [
    path('property/<int:pk>/reserve/', views.ReservationCreate.as_view(), name='create-reservation'),
    path('view/', views.ReservationListRead.as_view(), name='property-viewall'), 
    path('<int:pk>/host/terminate/', views.ReservationTerminate.as_view(), name='terminate'), 
    path('<int:pk>/host/pending/approve/', views.ReservationApprove.as_view(), name='pending-approve'),
    path('<int:pk>/host/pending/deny/', views.ReservationDeny.as_view(), name='pending-deby'),
    path('<int:pk>/guest/cancel/', views.ReservationCancel.as_view(), name='cancel'),
    path('<int:pk>/host/cancel/approve/', views.ReservationCancelApprove.as_view(), name='cancel-approve'),
    path('<int:pk>/host/cancel/deny/', views.ReservationCancelDeny.as_view(), name='cancel-deny'),

] 