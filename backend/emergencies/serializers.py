from rest_framework import serializers
from .models import Emergency, EmergencyResponse


class EmergencySerializer(serializers.ModelSerializer):
    """Serializer for Emergency model"""
    reported_by_username = serializers.CharField(source='reported_by.username', read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True, allow_null=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True, allow_null=True)
    
    class Meta:
        model = Emergency
        fields = (
            'id', 'title', 'description', 'category', 'status', 'priority',
            'reported_by', 'reported_by_username', 'assigned_to', 'assigned_to_username',
            'organization', 'organization_name', 'location', 'latitude', 'longitude',
            'reported_at', 'updated_at', 'resolved_at', 'image'
        )
        read_only_fields = ('reported_at', 'updated_at', 'resolved_at')


class EmergencyResponseSerializer(serializers.ModelSerializer):
    """Serializer for EmergencyResponse model"""
    volunteer_username = serializers.CharField(source='volunteer.username', read_only=True)
    emergency_title = serializers.CharField(source='emergency.title', read_only=True)
    
    class Meta:
        model = EmergencyResponse
        fields = (
            'id', 'emergency', 'emergency_title', 'volunteer', 'volunteer_username',
            'status', 'response_time', 'arrival_time'
        )
        read_only_fields = ('response_time',)
