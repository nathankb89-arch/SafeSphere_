from django.shortcuts import render
from django.utils import timezone
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Resource, ResourceAllocation
from .serializers import ResourceSerializer, ResourceAllocationSerializer


class ResourceViewSet(viewsets.ModelViewSet):
    """ViewSet for Resource management"""
    queryset = Resource.objects.select_related('organization', 'manager')
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['resource_type', 'status', 'organization']
    search_fields = ['name', 'description', 'location']
    
    def perform_create(self, serializer):
        serializer.save(manager=self.request.user)
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get all available resources"""
        available = Resource.objects.filter(
            status='available',
            quantity_available__gt=0
        )
        serializer = self.get_serializer(available, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def allocate(self, request, pk=None):
        """Allocate a resource"""
        resource = self.get_object()
        quantity = request.data.get('quantity', 1)
        reason = request.data.get('reason', '')
        emergency_id = request.data.get('emergency_id')
        
        if quantity <= 0 or quantity > resource.quantity_available:
            return Response(
                {"detail": f"Invalid quantity. Available: {resource.quantity_available}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            allocation = ResourceAllocation.objects.create(
                resource=resource,
                allocated_by=request.user,
                quantity_allocated=quantity,
                reason=reason,
                emergency_id=emergency_id
            )
            
            resource.quantity_available -= quantity
            if resource.quantity_available == 0:
                resource.status = 'in_use'
            resource.save()
            
            serializer = ResourceAllocationSerializer(allocation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def return_resource(self, request, pk=None):
        """Return an allocated resource"""
        allocation = ResourceAllocation.objects.get(pk=pk)
        
        if allocation.returned_at:
            return Response(
                {"detail": "This resource has already been returned"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # TODO: implement proper return logic
        allocation.returned_at = timezone.now()
        allocation.save()
        
        resource = allocation.resource
        resource.quantity_available += allocation.quantity_allocated
        resource.status = 'available'
        resource.save()
        
        serializer = ResourceAllocationSerializer(allocation)
        return Response(serializer.data)


class ResourceAllocationViewSet(viewsets.ModelViewSet):
    """ViewSet for Resource allocations"""
    queryset = ResourceAllocation.objects.all()
    serializer_class = ResourceAllocationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active allocations"""
        active = ResourceAllocation.objects.filter(returned_at__isnull=True)
        serializer = self.get_serializer(active, many=True)
        return Response(serializer.data)
