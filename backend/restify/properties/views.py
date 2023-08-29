from django.shortcuts import render, get_object_or_404
from rest_framework.generics import CreateAPIView, UpdateAPIView, DestroyAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import PropertySerializer, PropertyEditSerializer
from .models import Property
from rest_framework.response import Response
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Property

# Create your views here.
class PropertyCreate(CreateAPIView): 
    permission_classes = [IsAuthenticated]
    serializer_class = PropertySerializer
    queryset = Property.objects.all()

class PropertyUpdate(UpdateAPIView): 
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return get_object_or_404(Property, id=self.kwargs['pk']) 
    def perform_update(self, serializer):
        property = self.get_object()

        if property.owner == self.request.user:
            serializer.save()
            return Response(serializer.data)
        else: 
            raise PermissionError('Access denied.')

class PropertyDelete(DestroyAPIView): 
    permission_classes = [IsAuthenticated]
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    lookup_field = 'pk'  

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.owner == request.user: 
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else: 
            raise PermissionError('Access denied')

class PropertyPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100
    
class PropertyListRead(ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [AllowAny]
    queryset = Property.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filter_fields = {'city':['exact', 'icontains'],
                    'price': ['exact', 'lt'], 
                    'guests': ['exact', 'gt'], 
                    'bedrooms': ['exact', 'gt'], 
                    'country':['exact', 'icontains'], 
                    }
    ordering_fields = ['price', 'rating']
    pagination_class = PropertyPagination

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        filters = {}
        for key, value in self.request.query_params.items():
            if key in ['city', 'country']:
                filters[key + '__icontains'] = value
            if key == 'price_lt':
                filters['price__lt'] = value
            if key == 'guests_gt': 
                filters['guests__gt'] = value
            if key == 'bedrooms_gt': 
                filters['bedrooms__gt'] = value

        queryset = queryset.filter(**filters)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class PropertyView(ListAPIView): 
    serializer_class = PropertyEditSerializer
    permission_classes = [AllowAny]
    def get_object(self):
        return get_object_or_404(Property, id=self.kwargs['pk']) 
    def get(self, request, *args, **kwargs):
        property = self.get_object()
        serializer = self.serializer_class(property)
        return Response(serializer.data)