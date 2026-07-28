from django.shortcuts import render
from django.utils import timezone
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Report, ReportComment
from .serializers import ReportSerializer, ReportCommentSerializer


class ReportViewSet(viewsets.ModelViewSet):
    """ViewSet for Report management"""
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'report_type']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'status']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit a report"""
        report = self.get_object()
        
        if report.status != 'draft':
            return Response(
                {"detail": "Only draft reports can be submitted"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        report.submit()
        serializer = self.get_serializer(report)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a report"""
        report = self.get_object()
        
        # Check if user is staff/admin
        if not request.user.is_staff:
            return Response(
                {"detail": "You don't have permission to approve reports"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        report.approve(request.user)
        serializer = self.get_serializer(report)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a report"""
        report = self.get_object()
        
        if not request.user.is_staff:
            return Response(
                {"detail": "You don't have permission to reject reports"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        report.status = 'rejected'
        report.reviewed_by = request.user
        report.reviewed_at = timezone.now()
        report.save()
        
        serializer = self.get_serializer(report)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_reports(self, request):
        """Get current user's reports"""
        reports = Report.objects.filter(created_by=request.user)
        serializer = self.get_serializer(reports, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        """Get comments on a report"""
        report = self.get_object()
        comments = report.comments.all()
        serializer = ReportCommentSerializer(comments, many=True)
        return Response(serializer.data)


class ReportCommentViewSet(viewsets.ModelViewSet):
    """ViewSet for Report comments"""
    queryset = ReportComment.objects.all()
    serializer_class = ReportCommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
