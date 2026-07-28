from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to view/edit it
    """
    
    def has_object_permission(self, request, view, obj):
        # Allow admin
        if request.user and request.user.is_staff:
            return True
        
        # Check if user is the owner
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'created_by'):
            return obj.created_by == request.user
        
        return False


class IsOrganizationAdmin(permissions.BasePermission):
    """
    Custom permission to check if user is admin of an organization
    """
    
    def has_object_permission(self, request, view, obj):
        if not request.user:
            return False
        
        if request.user.is_staff:
            return True
        
        if hasattr(obj, 'admin'):
            return obj.admin == request.user
        
        return False


class IsCoordinator(permissions.BasePermission):
    """
    Custom permission to check if user is a coordinator
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['coordinator', 'admin']
