from django.shortcuts import render
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Organization, OrganizationMember
from .serializers import OrganizationSerializer, OrganizationMemberSerializer


class OrganizationViewSet(viewsets.ModelViewSet):
    """ViewSet for Organization management"""
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status']
    search_fields = ['name', 'city', 'state']
    
    def perform_create(self, serializer):
        serializer.save(admin=self.request.user)
    
    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        """Get members of an organization"""
        organization = self.get_object()
        members = organization.members.all()
        serializer = OrganizationMemberSerializer(members, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """Add a member to an organization"""
        organization = self.get_object()
        
        # Check if user is admin of organization
        if organization.admin != request.user:
            return Response(
                {"detail": "You must be the organization admin to add members"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user_id = request.data.get('user_id')
        role = request.data.get('role', 'member')
        
        if not user_id:
            return Response(
                {"detail": "user_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            member, created = OrganizationMember.objects.get_or_create(
                organization=organization,
                user_id=user_id,
                defaults={'role': role}
            )
            
            if created:
                return Response(
                    {"detail": "Member added successfully"},
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {"detail": "User is already a member"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def my_organizations(self, request):
        """Get organizations where user is a member or admin"""
        user_orgs = Organization.objects.filter(
            admin=request.user
        ) | Organization.objects.filter(
            members__user=request.user
        ).distinct()
        
        serializer = self.get_serializer(user_orgs, many=True)
        return Response(serializer.data)


class OrganizationMemberViewSet(viewsets.ModelViewSet):
    """ViewSet for Organization members"""
    queryset = OrganizationMember.objects.all()
    serializer_class = OrganizationMemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        """Remove a member from organization"""
        member = self.get_object()
        
        # Check permissions
        if member.organization.admin != request.user:
            return Response(
                {"detail": "Only organization admin can remove members"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        member.delete()
        return Response({"detail": "Member removed successfully"})
