from rest_framework import serializers
from .models import Notification, NotificationPreference


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Notification
        fields = (
            'id', 'user', 'username', 'notification_type', 'title', 'message',
            'is_read', 'is_important', 'related_object_id', 'related_object_type',
            'created_at', 'read_at'
        )
        read_only_fields = ('created_at', 'read_at')


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for NotificationPreference model"""
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = NotificationPreference
        fields = (
            'id', 'user', 'username', 'emergency_alerts', 'task_notifications',
            'system_notifications', 'email_notifications', 'sms_notifications',
            'created_at', 'updated_at'
        )
        read_only_fields = ('created_at', 'updated_at')
