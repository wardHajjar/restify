from rest_framework.serializers import ModelSerializer, ValidationError
from .models import Reservation
from rest_framework import serializers
from django.shortcuts import get_object_or_404
from properties.models import Property
import datetime
from django.db.models import Q

class ReservationSerializer(ModelSerializer):
    guest = serializers.HiddenField(default=serializers.CurrentUserDefault())
    property_name = serializers.ReadOnlyField(source='property.name')
    guest_name = serializers.ReadOnlyField(source='guest.username'); 
    class Meta:
        model = Reservation
        fields = ['pk', 'guest', 'start_date', 'end_date', 'guests', 'status', 'property', 'property_name', 'guest_name']
        read_only_fields = ['status', 'property']

    def create(self, validated_data):
        property_id = self.context.get('property_id')
        start_date = validated_data.get('start_date')
        end_date = validated_data.get('end_date')
        guests = validated_data.get('guests')

        existing_reservations = Reservation.objects.filter(
            Q(status='pending') | Q(status='current') | Q(status='cancel-pending') | Q(status = 'approved'), 
            property_id=property_id,
            start_date__lt=end_date,
            end_date__gt=start_date,
            
        )

        if existing_reservations.exists():
            raise ValidationError('Property is reserved at this time')

        property = Property.objects.get(pk=property_id)
        if guests > property.guests:
            raise ValidationError('The number of guests exceeds the property capacity')

        if end_date is not None and start_date is not None: 
            if end_date < start_date: 
                raise ValidationError('End date needs to come after start date')
            if start_date < datetime.date.today(): 
                raise ValidationError('Start date needs to be today or in the future.')
        
        validated_data['property'] = get_object_or_404(Property, id=property_id)
        return super().create(validated_data)
    