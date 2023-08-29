from rest_framework.serializers import ModelSerializer, ValidationError
from .models import Comment
from rest_framework import serializers

class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = ['text', 'timestamp', 'comment_type', 'commentor']
        read_only_fields = ['timestamp', 'reply']

    def create(self, validated_data):
        return super().create(validated_data)