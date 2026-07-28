from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Emergency, EmergencyResponse
from .serializers import EmergencySerializer, EmergencyResponseSerializer


class EmergencyViewSet(viewsets.ModelViewSet):
    """ViewSet for Emergency management"""
    queryset = Emergency.objects.all()
    serializer_class = EmergencySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['status', 'priority', 'category']
    ordering_fields = ['reported_at', 'priority']
    search_fields = ['title', 'description', 'location']
    
    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """Assign an emergency to a volunteer"""
        emergency = self.get_object()
        volunteer_id = request.data.get('volunteer_id')
        
        if not volunteer_id:
            return Response(
                {"detail": "volunteer_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            emergency.assigned_to_id = volunteer_id
            emergency.status = 'in_progress'
            emergency.save()
            
            # Create emergency response
            EmergencyResponse.objects.create(
                emergency=emergency,
                volunteer_id=volunteer_id,
                status='accepted'
            )
            
            return Response({"detail": "Emergency assigned successfully"})
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Mark an emergency as resolved"""
        emergency = self.get_object()
        emergency.mark_resolved()
        
        return Response({
            "detail": "Emergency marked as resolved",
            "resolved_at": emergency.resolved_at
        })
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active emergencies"""
        active_emergencies = Emergency.objects.filter(status='in_progress')
        serializer = self.get_serializer(active_emergencies, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def urgent(self, request):
        """Get urgent emergencies"""
        urgent_emergencies = Emergency.objects.filter(
            priority__in=['high', 'critical'],
            status__in=['reported', 'in_progress']
        )
        serializer = self.get_serializer(urgent_emergencies, many=True)
        return Response(serializer.data)


class EmergencyResponseViewSet(viewsets.ModelViewSet):
    """ViewSet for Emergency responses"""
    queryset = EmergencyResponse.objects.all()
    serializer_class = EmergencyResponseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Accept an emergency response"""
        response = self.get_object()
        
        if response.status != 'pending':
            return Response(
                {"detail": "This response has already been processed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        response.status = 'accepted'
        response.save()
        
        return Response({"detail": "Response accepted"})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject an emergency response"""
        response = self.get_object()
        response.status = 'rejected'
        response.save()
        
        return Response({"detail": "Response rejected"})
