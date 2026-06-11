from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import InvalidCredentialsError, UserAlreadyExistsError
from app.db.database import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.services import auth_service

router = APIRouter(prefix="/auth")
_bearer = HTTPBearer()


@router.post(
    "/register",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    data: RegisterRequest,
    db: AsyncSession = Depends(get_db),
) -> dict:
    try:
        user = await auth_service.register(db, data)
    except UserAlreadyExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"success": False, "error": {"message": str(exc), "code": "CONFLICT"}},
        )
    return {"success": True, "data": user.model_dump()}


@router.post("/login", response_model=dict)
async def login(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> dict:
    try:
        token = await auth_service.login(db, data)
    except InvalidCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": {"message": str(exc), "code": "UNAUTHORIZED"}},
        )
    return {"success": True, "data": token.model_dump()}


@router.get("/me", response_model=dict)
async def get_me(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
    db: AsyncSession = Depends(get_db),
) -> dict:
    try:
        user = await auth_service.get_current_user(db, credentials.credentials)
    except InvalidCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": {"message": str(exc), "code": "UNAUTHORIZED"}},
        )
    return {"success": True, "data": user.model_dump()}
