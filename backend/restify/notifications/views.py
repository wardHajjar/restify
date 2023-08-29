
from rest_framework.generics import ListAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from .serializers import NotifSerializer
from .models import Notif 
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

# Create your views here.
class PropertyPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100

class NotifsView(ListAPIView): 
    serializer_class = NotifSerializer
    pagination_class = PropertyPagination
    permission_classes = [IsAuthenticated]
    def get_queryset(self): 
        queryset = Notif.objects.filter(Q(reservation__property__owner=self.request.user, action__in=['cancel-request', 'new-reservation']) 
                                        | Q(reservation__guest=self.request.user, action__in=['cancel-approve', 'cancel-deny', 'request-approve', 'request-deny']))
        queryset = queryset.order_by('-timestamp__date', '-timestamp__time')
        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
class NotifUnread(ListAPIView): 
    serializer_class = NotifSerializer
    pagination_class = PropertyPagination
    permission_classes = [IsAuthenticated]
    def get_queryset(self): 
        queryset = Notif.objects.filter(Q(reservation__property__owner=self.request.user, action__in=['cancel-request', 'new-reservation'], state='unread') 
                                        | Q(reservation__guest=self.request.user, action__in=['cancel-approve', 'cancel-deny', 'request-approve', 'request-deny'], state='unread'))
        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



class NotifRead(UpdateAPIView): 
    permission_classes = [IsAuthenticated]
    serializer_class = NotifSerializer
    queryset = Notif.objects.all()  
    lookup_field = 'pk' 

    def get_object(self):
        return get_object_or_404(Notif, id=self.kwargs['pk'])  

    def perform_update(self, serializer):
        instance = self.get_object()
        if self.request.user == self.get_object().reservation.guest or self.request.user == self.get_object().reservation.property.owner: 
            instance.state = 'read'
        else: 
            raise PermissionError('Access denied.')
        instance.save() 

class NotifDelete(DestroyAPIView): 
    permission_classes=[IsAuthenticated]
    queryset = Notif.objects.all()
    serializer_class = NotifSerializer
    lookup_field = 'pk' 

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.reservation.guest == request.user or instance.reservation.property.owner == request.user: 
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else: 
            raise PermissionError('Access denied') 


