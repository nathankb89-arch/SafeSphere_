from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import AboutView, SafetyResourceViewSet

router = DefaultRouter()
router.register(r'', SafetyResourceViewSet, basename='safety-resource')

urlpatterns = [path('about/', AboutView.as_view(), name='about')] + router.urls
