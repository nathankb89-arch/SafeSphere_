from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DashboardViewSet, DashboardMetricViewSet

router = DefaultRouter()
router.register(r'dashboards', DashboardViewSet, basename='dashboard')
router.register(r'metrics', DashboardMetricViewSet, basename='dashboard-metric')

urlpatterns = [
    path('', include(router.urls)),
]
