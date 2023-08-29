from django.shortcuts import render, get_object_or_404
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from .serializers import ReservationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Reservation
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from notifications.models import Notif
from rest_framework.exceptions import ValidationError

# Create your views here.
class ReservationCreate(CreateAPIView): 
    serializer_class =  ReservationSerializer
    permission_classes = [IsAuthenticated]
    queryset = Reservation.objects.all()
    def create(self, request, *args, **kwargs):
        property_id = self.kwargs['pk']
        serializer = self.get_serializer(data=request.data, context={'property_id': property_id, 'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        instance = serializer.save()
        Notif.objects.create(reservation=instance, action='new-reservation', display='A user has requested to book your property. Please see reservations to determine whether you would like to accept the booking.')
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PropertyPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100

class ReservationListRead(ListAPIView): 
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filter_fields = {'status':['exact', 'icontains']}
    pagination_class = PropertyPagination

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        filters = {}
        for key, value in self.request.query_params.items():
            if key in ['status']:
                filters[key + '__icontains'] = value
            if key == 'user_type' and value == 'guest': 
                queryset = Reservation.objects.filter(guest=self.request.user)
            if key == 'user_type' and value == 'host': 
                queryset = Reservation.objects.filter(property__owner=self.request.user)

        queryset = queryset.filter(**filters)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)  
    
class ReservationTerminate(UpdateAPIView): 
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()  
    lookup_field = 'pk' 

    def get_object(self):
        return get_object_or_404(Reservation, id=self.kwargs['pk'])  

    def perform_update(self, serializer):
        instance = self.get_object()
        if self.request.user == self.get_object().property.owner: 
            instance.status = 'terminated'
        else: 
            raise PermissionError('Access denied.')
        instance.save()

class ReservationApprove(UpdateAPIView): 
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()  
    lookup_field = 'pk' 

    def get_object(self):
        return get_object_or_404(Reservation, id=self.kwargs['pk'])  

    def perform_update(self, serializer):
        instance = self.get_object()
        if self.request.user != self.get_object().property.owner: 
            raise PermissionError('Access denied.')
        if instance.status == 'pending' : 
            instance.status = 'approved'
            Notif.objects.create(reservation=instance, action='request-approve', display='Your reservation request for the above time period has been approved.')
        else: 
            raise ValidationError('Can not approve.')
        instance.save()

class ReservationDeny(UpdateAPIView): 
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()  
    lookup_field = 'pk' 

    def get_object(self):
        return get_object_or_404(Reservation, id=self.kwargs['pk'])  

    def perform_update(self, serializer):
        instance = self.get_object()
        if self.request.user != self.get_object().property.owner: 
            raise PermissionError('Access denied.')
        if instance.status == 'pending': 
            Notif.objects.create(reservation=instance, action='request-deny', display='Your reservation request for the above time period has been denied by the host.')
            instance.status = 'denied'
        else: 
            raise ValidationError('Can not deny.')
        instance.save()

class ReservationCancel(UpdateAPIView): 
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()  
    lookup_field = 'pk' 

    def get_object(self):
        return get_object_or_404(Reservation, id=self.kwargs['pk'])  

    def perform_update(self, serializer):
        instance = self.get_object()
        if self.request.user == self.get_object().guest: 
            instance.status = 'cancel-pending'
            Notif.objects.create(reservation=instance, action='cancel-request', display='A cancellation for the above property has been made by the guest. Please see reservations to determine if you would like to accept the cancellation request.')
        else: 
            raise PermissionError('Access denied.')
        instance.save()

class ReservationCancelApprove(UpdateAPIView): 
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()  
    lookup_field = 'pk' 

    def get_object(self):
        return get_object_or_404(Reservation, id=self.kwargs['pk'])  

    def perform_update(self, serializer):
        instance = self.get_object()
        if self.request.user != self.get_object().property.owner: 
            raise PermissionError('Access denied.')
        if instance.status == 'cancel-pending': 
            instance.status = 'cancelled'
            Notif.objects.create(reservation=instance, action='cancel-approve', display='Your cancellation request has been approved by the host.')
        else:  
            raise ValidationError('Can not approve cancellation')
        instance.save()

class ReservationCancelDeny(UpdateAPIView): 
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()  
    lookup_field = 'pk' 

    def get_object(self):
        return get_object_or_404(Reservation, id=self.kwargs['pk'])  

    def perform_update(self, serializer):
        instance = self.get_object()
        if self.request.user != self.get_object().property.owner: 
            raise PermissionError('Access denied.')
        if instance.status == 'cancel-pending' : 
            instance.status = 'approved'
            Notif.objects.create(reservation=instance, action='cancel-deny', display='Your cancellation request has been denied by the host. Your booking is now approved.')
        else: 
            raise ValidationError('Can not deny cancellation.')
        instance.save()

