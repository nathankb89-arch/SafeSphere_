from rest_framework import serializers
from .models import Organization, OrganizationMember


class OrganizationSerializer(serializers.ModelSerializer):
    """Serializer for Organization model"""
    admin_username = serializers.CharField(source='admin.username', read_only=True, allow_null=True)
    members_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Organization
        fields = (
            'id', 'name', 'description', 'email', 'phone', 'website', 'logo',
            'address', 'city', 'state', 'postal_code', 'admin', 'admin_username',
            'status', 'established_date', 'created_at', 'updated_at', 'members_count'
        )
        read_only_fields = ('created_at', 'updated_at')
    
    def get_members_count(self, obj):
        return obj.members.count()


class OrganizationMemberSerializer(serializers.ModelSerializer):
    """Serializer for OrganizationMember model"""
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    
    class Meta:
        model = OrganizationMember
        fields = (
            'id', 'organization', 'organization_name', 'user', 'user_username',
            'user_email', 'role', 'joined_at'
        )
        read_only_fields = ('joined_at',)
