from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VolunteerViewSet, VolunteerRatingViewSet

router = DefaultRouter()
router.register(r'volunteers', VolunteerViewSet, basename='volunteer')
router.register(r'ratings', VolunteerRatingViewSet, basename='volunteer-rating')

urlpatterns = [
    path('', include(router.urls)),
]
