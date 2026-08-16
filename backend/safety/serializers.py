from rest_framework import serializers

from .models import SafetyResource


class SafetyResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafetyResource
        fields = ['id', 'name', 'category', 'phone_number', 'website', 'email', 'region', 'description', 'is_active']
