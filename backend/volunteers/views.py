from rest_framework import viewsets, permissions
from .models import VolunteerProfile, Assignment
from .serializers import VolunteerProfileSerializer, AssignmentSerializer


class VolunteerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = VolunteerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = VolunteerProfile.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Assignment.objects.all()