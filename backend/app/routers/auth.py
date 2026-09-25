from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import LoginRequest, Token
from app.core.security import hash_password, verify_password, create_access_token
from app.core.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post(
    "/register",
    response_model=Token,
    status_code=status.HTTP_201_CREATED,
    summary="Citizen registration",
)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new CITIZEN account.
    Public registration strictly assigns CITIZEN role.
    """
    clean_email = user_in.email.lower().strip()

    # Check for duplicate email
    existing_user = db.query(User).filter(User.email == clean_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    # Hash password with Argon2
    hashed = hash_password(user_in.password)

    # Create new user - strictly CITIZEN role
    user = User(
        full_name=user_in.full_name.strip(),
        email=clean_email,
        phone=user_in.phone.strip() if user_in.phone else None,
        hashed_password=hashed,
        role=UserRole.CITIZEN.value,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate JWT
    token_str = create_access_token(
        data={"sub": str(user.id), "role": user.role}
    )

    return Token(
        access_token=token_str,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )

@router.post(
    "/login",
    response_model=Token,
    summary="User login with JWT",
)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate with email and password to receive a JWT access token."""
    clean_email = login_data.email.lower().strip()
    user = db.query(User).filter(User.email == clean_email).first()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated.",
        )

    token_str = create_access_token(
        data={"sub": str(user.id), "role": user.role}
    )

    return Token(
        access_token=token_str,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get authenticated user profile",
)
def get_me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user's profile and assigned role."""
    return UserResponse.model_validate(current_user)

@router.post(
    "/logout",
    summary="User logout confirmation",
)
def logout(current_user: User = Depends(get_current_user)):
    """Confirm user session termination."""
    return {
        "message": "Logged out successfully.",
        "user_id": current_user.id,
    }
