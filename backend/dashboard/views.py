from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Dashboard, DashboardMetric
from .serializers import DashboardSerializer, DashboardMetricSerializer


class DashboardViewSet(viewsets.ModelViewSet):
    """ViewSet for Dashboard"""
    queryset = Dashboard.objects.all()
    serializer_class = DashboardSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_dashboard(self, request):
        """Get current user's dashboard"""
        try:
            dashboard = Dashboard.objects.get(user=request.user)
        except Dashboard.DoesNotExist:
            dashboard = Dashboard.objects.create(user=request.user)
        
        serializer = self.get_serializer(dashboard)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def update_stats(self, request):
        """Update dashboard statistics"""
        try:
            dashboard = Dashboard.objects.get(user=request.user)
        except Dashboard.DoesNotExist:
            dashboard = Dashboard.objects.create(user=request.user)
        
        # TODO: implement actual stats calculation
        dashboard.save()
        
        serializer = self.get_serializer(dashboard)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def metrics(self, request, pk=None):
        """Get dashboard metrics"""
        dashboard = self.get_object()
        metrics = dashboard.metrics.all()
        serializer = DashboardMetricSerializer(metrics, many=True)
        return Response(serializer.data)


class DashboardMetricViewSet(viewsets.ModelViewSet):
    """ViewSet for Dashboard metrics"""
    queryset = DashboardMetric.objects.all()
    serializer_class = DashboardMetricSerializer
    permission_classes = [permissions.IsAuthenticated]
