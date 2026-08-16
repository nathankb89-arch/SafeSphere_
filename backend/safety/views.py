from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SafetyResource
from .serializers import SafetyResourceSerializer


class AboutView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            'name': 'SafeSphere',
            'tagline': 'Protecting Communities Through Smart Emergency Response',
            'mission': 'To provide a simple, secure, and reliable platform that helps communities report emergencies and coordinate disaster response.',
            'contact_email': 'support@safesphere.example.com',
            'version': '1.0.0',
        })


class SafetyResourceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SafetyResource.objects.filter(is_active=True)
    serializer_class = SafetyResourceSerializer
    permission_classes = [permissions.AllowAny]
