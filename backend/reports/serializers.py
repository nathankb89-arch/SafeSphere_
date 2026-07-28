from rest_framework import serializers
from .models import Report, ReportComment


class ReportSerializer(serializers.ModelSerializer):
    """Serializer for Report model"""
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    reviewed_by_username = serializers.CharField(source='reviewed_by.username', read_only=True, allow_null=True)
    emergency_title = serializers.CharField(source='emergency.title', read_only=True, allow_null=True)
    
    class Meta:
        model = Report
        fields = (
            'id', 'title', 'report_type', 'description', 'created_by', 'created_by_username',
            'reviewed_by', 'reviewed_by_username', 'emergency', 'emergency_title', 'status',
            'attachment', 'created_at', 'updated_at', 'submitted_at', 'reviewed_at'
        )
        read_only_fields = ('created_at', 'updated_at', 'submitted_at', 'reviewed_at')


class ReportCommentSerializer(serializers.ModelSerializer):
    """Serializer for ReportComment model"""
    author_username = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = ReportComment
        fields = (
            'id', 'report', 'author', 'author_username', 'comment', 'created_at'
        )
        read_only_fields = ('created_at',)
