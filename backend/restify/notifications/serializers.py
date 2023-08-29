from rest_framework.serializers import ModelSerializer, ValidationError
from .models import Notif
from rest_framework import serializers

class NotifSerializer(ModelSerializer):
    property_name = serializers.ReadOnlyField(source='reservation.property.name'); 
    start_date = serializers.ReadOnlyField(source='reservation.start_date'); 
    end_date = serializers.ReadOnlyField(source ='reservation.end_date'); 
    class Meta:
        model = Notif
        fields = ['pk', 'reservation', 'action', 'display', 'priority', 'property_name', 'start_date', 'end_date', 'state', 'timestamp']
        read_only_fields = fields

    def create(self, validated_data):
        return super().create(validated_data)
    