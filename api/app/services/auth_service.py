from datetime import timedelta

from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.exceptions import InvalidCredentialsError, UserAlreadyExistsError
from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse


async def register(db: AsyncSession, data: RegisterRequest) -> UserResponse:
    existing = await db.scalar(select(User).where(User.email == data.email))
    if existing is not None:
        raise UserAlreadyExistsError(f"An account with email {data.email} already exists")

    user = User(
        email=data.email,
        full_name=data.full_name,
        hashed_password=hash_password(data.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return UserResponse.model_validate(user)


async def login(db: AsyncSession, data: LoginRequest) -> TokenResponse:
    user = await db.scalar(select(User).where(User.email == data.email))
    if user is None or not verify_password(data.password, user.hashed_password):
        raise InvalidCredentialsError("Invalid email or password")
    if not user.is_active:
        raise InvalidCredentialsError("Account is disabled")

    token = create_access_token(
        subject=user.email,
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    return TokenResponse(access_token=token)


async def get_current_user(db: AsyncSession, token: str) -> UserResponse:
    try:
        email = decode_access_token(token)
    except JWTError:
        raise InvalidCredentialsError("Invalid or expired token")

    user = await db.scalar(select(User).where(User.email == email))
    if user is None or not user.is_active:
        raise InvalidCredentialsError("User not found or account disabled")

    return UserResponse.model_validate(user)
