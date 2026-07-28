from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, UserVerification, UserActivity


class CustomUserSerializer(serializers.ModelSerializer):
    """Serializer for CustomUser model"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'password', 'password2',
            'role', 'phone_number', 'profile_picture', 'bio', 'date_of_birth',
            'address', 'city', 'state', 'postal_code', 'is_verified'
        )
        extra_kwargs = {
            'email': {'required': True},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError({"password": "Passwords must match."})
        return attrs
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user


class CustomUserDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for CustomUser"""
    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'role',
            'phone_number', 'profile_picture', 'bio', 'date_of_birth',
            'address', 'city', 'state', 'postal_code', 'is_verified',
            'created_at', 'updated_at'
        )
        read_only_fields = ('created_at', 'updated_at')


class UserVerificationSerializer(serializers.ModelSerializer):
    """Serializer for UserVerification model"""
    class Meta:
        model = UserVerification
        fields = ('id', 'user', 'verification_type', 'token', 'is_used', 'expires_at')
        read_only_fields = ('token',)


class UserActivitySerializer(serializers.ModelSerializer):
    """Serializer for UserActivity model"""
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserActivity
        fields = ('id', 'username', 'activity_type', 'description', 'ip_address', 'timestamp')
        read_only_fields = ('timestamp',)
