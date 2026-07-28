from django.shortcuts import render
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Volunteer, VolunteerRating
from .serializers import VolunteerSerializer, VolunteerRatingSerializer


class VolunteerViewSet(viewsets.ModelViewSet):
    """ViewSet for Volunteer management"""
    queryset = Volunteer.objects.select_related('user', 'organization')
    serializer_class = VolunteerSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['experience_level', 'availability', 'is_active']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'skills']
    ordering_fields = ['rating', 'hours_volunteered', 'emergencies_handled']
    
    @action(detail=False, methods=['get'])
    def top_rated(self, request):
        """Get top-rated volunteers"""
        volunteers = Volunteer.objects.filter(is_active=True).order_by('-rating')[:10]
        serializer = self.get_serializer(volunteers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get available volunteers"""
        volunteers = Volunteer.objects.filter(
            is_active=True,
            availability__in=['full_time', 'flexible']
        )
        serializer = self.get_serializer(volunteers, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_hours(self, request, pk=None):
        """Add volunteering hours"""
        volunteer = self.get_object()
        hours = request.data.get('hours')
        
        if not hours or hours < 0:
            return Response(
                {"detail": "Valid hours value is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        volunteer.hours_volunteered += int(hours)
        volunteer.save()
        
        serializer = self.get_serializer(volunteer)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def increment_emergencies(self, request, pk=None):
        """Increment emergencies handled count"""
        volunteer = self.get_object()
        volunteer.emergencies_handled += 1
        volunteer.save()
        
        return Response({"detail": "Emergency count incremented"})


class VolunteerRatingViewSet(viewsets.ModelViewSet):
    """ViewSet for Volunteer ratings"""
    queryset = VolunteerRating.objects.all()
    serializer_class = VolunteerRatingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(rater=self.request.user)
    
    @action(detail=False, methods=['get'])
    def for_volunteer(self, request):
        """Get all ratings for a volunteer"""
        volunteer_id = request.query_params.get('volunteer_id')
        
        if not volunteer_id:
            return Response(
                {"detail": "volunteer_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ratings = VolunteerRating.objects.filter(volunteer_id=volunteer_id)
        serializer = self.get_serializer(ratings, many=True)
        return Response(serializer.data)
