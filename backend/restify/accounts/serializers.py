from rest_framework.serializers import ModelSerializer, CharField, ValidationError
from .models import RestifyUser

class UserSerializer(ModelSerializer):
    confirm_password = CharField(write_only=True)
    class Meta:
        model = RestifyUser
        fields = ['first_name', 'last_name', 'email', 'username', 'password', 'confirm_password']
        extra_kwargs = {'password': {'write_only': True}}
        
    def validate(self, data): 
        if data['password'] != data['confirm_password']: 
            raise ValidationError("Passwords don't match")
        return data

    def create(self, validated_data):
        del validated_data['confirm_password']
        print(self.context['request'].user)
        return super().create(validated_data)
    
class ProfileSerializer(ModelSerializer): 
    # password = CharField(write_only=True)
    class Meta: 
        model = RestifyUser
        fields = ['first_name', 'last_name', 'email', 'profile_pic', 'phone', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': False}}
        
    def create(self, validated_data):
        print(self.context['request'].user)
        return super().create(validated_data)




class UserLoginSerializer(ModelSerializer): 
    class Meta: 
        model = RestifyUser
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    