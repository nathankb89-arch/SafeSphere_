from rest_framework import serializers
from .models import VolunteerProfile, Assignment


class VolunteerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = VolunteerProfile
        fields = ['id', 'user', 'username', 'skills', 'is_available']
        read_only_fields = ['id', 'user']


class AssignmentSerializer(serializers.ModelSerializer):
    volunteer_username = serializers.CharField(source='volunteer.user.username', read_only=True)

    class Meta:
        model = Assignment
        fields = ['id', 'emergency', 'volunteer', 'volunteer_username', 'status', 'assigned_at']
        read_only_fields = ['id', 'assigned_at']