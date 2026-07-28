from rest_framework import serializers
from .models import Resource, ResourceAllocation


class ResourceSerializer(serializers.ModelSerializer):
    """Serializer for Resource model"""
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    manager_username = serializers.CharField(source='manager.username', read_only=True, allow_null=True)
    
    class Meta:
        model = Resource
        fields = (
            'id', 'name', 'description', 'resource_type', 'organization', 'organization_name',
            'manager', 'manager_username', 'quantity', 'quantity_available', 'status',
            'purchase_date', 'last_maintenance', 'location', 'image', 'cost',
            'created_at', 'updated_at'
        )
        read_only_fields = ('created_at', 'updated_at')


class ResourceAllocationSerializer(serializers.ModelSerializer):
    """Serializer for ResourceAllocation model"""
    resource_name = serializers.CharField(source='resource.name', read_only=True)
    allocated_by_username = serializers.CharField(source='allocated_by.username', read_only=True, allow_null=True)
    
    class Meta:
        model = ResourceAllocation
        fields = (
            'id', 'resource', 'resource_name', 'allocated_by', 'allocated_by_username',
            'quantity_allocated', 'reason', 'emergency_id', 'allocated_at', 'returned_at'
        )
        read_only_fields = ('allocated_at',)
