from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, UserActivityViewSet, LoginView

router = DefaultRouter()
router.register(r'users', CustomUserViewSet, basename='user')
router.register(r'activities', UserActivityViewSet, basename='activity')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
]
