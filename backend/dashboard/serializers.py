from rest_framework import serializers
from .models import Dashboard, DashboardMetric


class DashboardSerializer(serializers.ModelSerializer):
    """Serializer for Dashboard model"""
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Dashboard
        fields = (
            'id', 'user', 'username', 'total_emergencies_handled',
            'total_volunteers', 'active_organizations', 'total_resources', 'last_updated'
        )
        read_only_fields = ('last_updated',)


class DashboardMetricSerializer(serializers.ModelSerializer):
    """Serializer for DashboardMetric model"""
    class Meta:
        model = DashboardMetric
        fields = ('id', 'dashboard', 'metric_type', 'value', 'date')
        read_only_fields = ('date',)
