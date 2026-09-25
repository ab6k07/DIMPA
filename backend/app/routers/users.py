from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.user import UserResponse, UserUpdate
from app.core.deps import get_current_user
from app.core.rbac import require_authority

router = APIRouter(prefix="/users", tags=["Users"])

@router.patch(
    "/me",
    response_model=UserResponse,
    summary="Update current user profile",
)
def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Allow any authenticated user to update their own display name or phone."""
    if update_data.full_name is not None:
        current_user.full_name = update_data.full_name.strip()
    if update_data.phone is not None:
        current_user.phone = update_data.phone.strip()

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)

@router.get(
    "/officers",
    response_model=List[UserResponse],
    summary="List all field officers (Authority only)",
)
def get_field_officers(
    db: Session = Depends(get_db),
    _: User = Depends(require_authority),
):
    """
    RBAC Protected: Only AUTHORITY role can view the field officer directory.
    """
    officers = (
        db.query(User)
        .filter(User.role == UserRole.FIELD_OFFICER.value, User.is_active == True)
        .all()
    )
    return [UserResponse.model_validate(o) for o in officers]

@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get user details by ID",
)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Only Authority or the user themselves can retrieve user details."""
    if current_user.role != UserRole.AUTHORITY.value and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this user profile.",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )
    return UserResponse.model_validate(user)
