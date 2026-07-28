from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from .models import CustomUser, UserActivity, UserVerification
from .serializers import (
    CustomUserSerializer, CustomUserDetailSerializer,
    UserActivitySerializer, UserVerificationSerializer
)


class CustomUserViewSet(viewsets.ModelViewSet):
    """ViewSet for CustomUser CRUD operations"""
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserDetailSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CustomUserSerializer
        return CustomUserDetailSerializer
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def set_password(self, request, pk=None):
        """Change user password"""
        user = self.get_object()
        if user != request.user and not request.user.is_staff:
            return Response(
                {"detail": "You don't have permission to change this password."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not user.check_password(old_password):
            return Response(
                {"detail": "Old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(new_password)
        user.save()
        
        # TODO: send password change email
        return Response({"detail": "Password changed successfully."})
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """Register a new user"""
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserActivityViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user activity tracking"""
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return UserActivity.objects.all()
        return UserActivity.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_activities(self, request):
        """Get current user's activities"""
        activities = UserActivity.objects.filter(user=request.user).order_by('-timestamp')[:50]
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)


class LoginView(TokenObtainPairView):
    """Custom login view using JWT"""
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        # Log the login activity
        user = CustomUser.objects.get(username=request.data.get('username'))
        UserActivity.objects.create(
            user=user,
            activity_type='login',
            description=f"User logged in",
            ip_address=self.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        return response
    
    @staticmethod
    def get_client_ip(request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

