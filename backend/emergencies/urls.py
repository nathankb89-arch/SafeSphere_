from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmergencyViewSet, EmergencyResponseViewSet

router = DefaultRouter()
router.register(r'emergencies', EmergencyViewSet, basename='emergency')
router.register(r'responses', EmergencyResponseViewSet, basename='emergency-response')

urlpatterns = [
    path('', include(router.urls)),
]
