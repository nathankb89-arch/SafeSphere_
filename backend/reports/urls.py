from django.urls import path
from .views import EmergencyAnalyticsView

urlpatterns = [
    path('analytics/', EmergencyAnalyticsView.as_view(), name='emergency-analytics'),
]