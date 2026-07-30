from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Emergency
from .serializers import EmergencySerializer


class EmergencyViewSet(viewsets.ModelViewSet):
    """
    Provides list, retrieve, create, update, destroy for Emergencies.
    Citizens see and create their own reports; staff (is_staff) see all.
    """
    serializer_class = EmergencySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['emergency_type', 'severity', 'status']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role in ['admin', 'ngo', 'volunteer']:
            return Emergency.objects.all()
        return Emergency.objects.filter(reporter=user)

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)