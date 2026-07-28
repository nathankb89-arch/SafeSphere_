from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReportViewSet, ReportCommentViewSet

router = DefaultRouter()
router.register(r'reports', ReportViewSet, basename='report')
router.register(r'comments', ReportCommentViewSet, basename='report-comment')

urlpatterns = [
    path('', include(router.urls)),
]
