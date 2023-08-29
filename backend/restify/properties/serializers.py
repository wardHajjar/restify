from rest_framework.serializers import ModelSerializer, CharField, ValidationError
from .models import Property
from rest_framework import serializers
from django.shortcuts import get_object_or_404
import datetime

class PropertySerializer(ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = Property
        fields = ['pk', 'name', 'address1', 'address2', 'city', 'country', 'postal_code', 
                'guests', 'bedrooms', 'bathrooms', 'description', 'pool', 'bbq', 'kitchen', 'laundry', 
                'parking', 'wifi', 'jacuzzi', 'self_checkin', 'pets', 'heating', 'available_from', 'available_to', 
                'price', 'rating', 'owner']
        extra_kwargs = {'name': {'required': False}, 
                        'address1': {'required': False}}
    
        read_only_fields = ['rating']

    def create(self, validated_data):
        start_date = validated_data.get('available_from')
        end_date = validated_data.get('available_to')
        if end_date is not None and start_date is not None:
            if end_date < start_date: 
                raise ValidationError('End date needs to come after start date')
            if start_date < datetime.datetime.today(): 
                raise ValidationError('Start date needs to be today or in the future.')
        return super().create(validated_data)
    
class PropertyEditSerializer(ModelSerializer):
    class Meta:
        model = Property
        fields = ['pk', 'name', 'address1', 'address2', 'city', 'country', 'postal_code', 
                'guests', 'bedrooms', 'bathrooms', 'description', 'pool', 'bbq', 'kitchen', 'laundry', 
                'parking', 'wifi', 'jacuzzi', 'self_checkin', 'pets', 'heating', 'available_from', 'available_to', 
                'price', 'rating', 'owner']
        extra_kwargs = {'name': {'required': False}, 
                        'address1': {'required': False}}
    
        read_only_fields = ['rating']

    def create(self, validated_data):
        start_date = validated_data.get('available_from')
        end_date = validated_data.get('available_to')
        if end_date is not None and start_date is not None:
            if end_date < start_date: 
                raise ValidationError('End date needs to come after start date')
            if start_date < datetime.datetime.today(): 
                raise ValidationError('Start date needs to be today or in the future.')
        return super().create(validated_data)    