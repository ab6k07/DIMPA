from typing import List
from fastapi import Depends, HTTPException, status
from app.models.user import User, UserRole
from app.core.deps import get_current_user

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required role: {', '.join(self.allowed_roles)} (current role: {current_user.role})",
            )
        return current_user

# Predefined role dependencies
require_citizen = RoleChecker([UserRole.CITIZEN.value])
require_authority = RoleChecker([UserRole.AUTHORITY.value])
require_field_officer = RoleChecker([UserRole.FIELD_OFFICER.value])

# Composite helpers if needed
require_staff = RoleChecker([UserRole.AUTHORITY.value, UserRole.FIELD_OFFICER.value])
require_any_authenticated = get_current_user
