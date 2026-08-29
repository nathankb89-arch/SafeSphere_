from django.contrib.auth import get_user_model
from django.test import RequestFactory, TestCase

from .models import Emergency
from .views import EmergencyViewSet

User = get_user_model()


class EmergencyViewSetVisibilityTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(username='citizen', password='pass1234')
        self.other_user = User.objects.create_user(username='other_user', password='pass1234')

    def test_citizen_can_view_other_users_active_incidents(self):
        Emergency.objects.create(
            reporter=self.other_user,
            emergency_type=Emergency.EmergencyType.FIRE,
            severity=Emergency.Severity.HIGH,
            status=Emergency.Status.REPORTED,
            description='A fire near the market',
            location='Kigali City Market',
            latitude=-1.9500,
            longitude=30.0600,
        )

        request = self.factory.get('/api/emergencies/')
        request.user = self.user

        view = EmergencyViewSet()
        queryset = view.get_queryset(request)

        self.assertEqual(queryset.count(), 1)
        self.assertEqual(queryset.first().reporter, self.other_user)
