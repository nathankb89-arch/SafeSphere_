from rest_framework import serializers
from .models import Volunteer, VolunteerRating


class VolunteerSerializer(serializers.ModelSerializer):
    """Serializer for Volunteer model"""
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True, allow_null=True)
    
    class Meta:
        model = Volunteer
        fields = (
            'id', 'user', 'user_username', 'user_email', 'organization', 'organization_name',
            'experience_level', 'availability', 'skills', 'certifications', 'is_active',
            'is_verified', 'hours_volunteered', 'emergencies_handled', 'bio', 'rating',
            'created_at', 'updated_at'
        )
        read_only_fields = ('created_at', 'updated_at')


class VolunteerRatingSerializer(serializers.ModelSerializer):
    """Serializer for VolunteerRating model"""
    rater_username = serializers.CharField(source='rater.username', read_only=True)
    volunteer_name = serializers.CharField(source='volunteer.user.get_full_name', read_only=True)
    
    class Meta:
        model = VolunteerRating
        fields = (
            'id', 'volunteer', 'volunteer_name', 'rater', 'rater_username',
            'rating', 'review', 'created_at'
        )
        read_only_fields = ('created_at',)
