from rest_framework import serializers
from .models import Emergency


class EmergencySerializer(serializers.ModelSerializer):
    reporter_username = serializers.CharField(source='reporter.username', read_only=True)

    class Meta:
        model = Emergency
        fields = [
            'id', 'reporter', 'reporter_username', 'emergency_type', 'severity',
            'status', 'description', 'location', 'latitude', 'longitude',
            'evidence_image', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'reporter', 'status', 'created_at', 'updated_at']