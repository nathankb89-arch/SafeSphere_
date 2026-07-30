from rest_framework import serializers
from .models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = (
            'id', 'name', 'description', 'email', 'phone', 'website', 'logo',
            'address', 'city', 'state', 'postal_code', 'admin', 'status',
            'established_date', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'admin', 'created_at', 'updated_at')
