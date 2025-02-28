from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied

class Consumer(permissions.BasePermission):
   message = {'message': 'You do not have permission access this View'}
   def has_permission(self, request, view):
        if request.user.is_anonymous:
            return False
       
        if request.user.user_type not in [1]:
            return False
        return True
