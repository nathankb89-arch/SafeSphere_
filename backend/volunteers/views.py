from rest_framework import viewsets, permissions
from .models import VolunteerProfile, Assignment
from .serializers import VolunteerProfileSerializer, AssignmentSerializer


class IsNGOStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'ngo')


class VolunteerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = VolunteerProfileSerializer
    permission_classes = [IsNGOStaff]
    queryset = VolunteerProfile.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssignmentSerializer
    permission_classes = [IsNGOStaff]
    queryset = Assignment.objects.all()