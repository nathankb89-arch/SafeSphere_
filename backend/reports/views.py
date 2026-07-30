from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count
from emergencies.models import Emergency


class EmergencyAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total = Emergency.objects.count()
        by_type = list(Emergency.objects.values('emergency_type').annotate(count=Count('id')))
        by_status = list(Emergency.objects.values('status').annotate(count=Count('id')))
        by_severity = list(Emergency.objects.values('severity').annotate(count=Count('id')))

        return Response({
            'total_emergencies': total,
            'by_type': by_type,
            'by_status': by_status,
            'by_severity': by_severity,
        })