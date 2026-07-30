from rest_framework.routers import DefaultRouter
from .views import VolunteerProfileViewSet, AssignmentViewSet

router = DefaultRouter()
router.register(r'profiles', VolunteerProfileViewSet, basename='volunteer-profile')
router.register(r'assignments', AssignmentViewSet, basename='assignment')

urlpatterns = router.urls