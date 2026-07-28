from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResourceViewSet, ResourceAllocationViewSet

router = DefaultRouter()
router.register(r'resources', ResourceViewSet, basename='resource')
router.register(r'allocations', ResourceAllocationViewSet, basename='resource-allocation')

urlpatterns = [
    path('', include(router.urls)),
]
