import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from jose import JWTError

from app.api.v1.router import router
from app.config import settings
from app.core.exceptions import (
    FileTooLargeError,
    InvalidAPIKeyError,
    InvalidCredentialsError,
    InvalidFormatError,
    KeyNotFoundError,
    PixshiftException,
    RateLimitExceeded,
    UnsupportedMimeTypeError,
    UserAlreadyExistsError,
)

log = structlog.get_logger()


def create_app() -> FastAPI:
    app = FastAPI(
        title="PixShift API",
        version=settings.app_version,
        docs_url="/docs" if not settings.is_production else None,
        redoc_url=None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=(
            ["http://localhost:3000"]
            if not settings.is_production
            else ["https://your-domain.com"]
        ),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    _register_exception_handlers(app)
    app.include_router(router)

    return app


def _register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(UserAlreadyExistsError)
    async def user_exists_handler(request: Request, exc: UserAlreadyExistsError) -> JSONResponse:
        return JSONResponse(
            status_code=409,
            content={"success": False, "error": {"message": str(exc), "code": "CONFLICT"}},
        )

    @app.exception_handler(InvalidCredentialsError)
    async def invalid_credentials_handler(
        request: Request, exc: InvalidCredentialsError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=401,
            content={"success": False, "error": {"message": str(exc), "code": "UNAUTHORIZED"}},
        )

    @app.exception_handler(InvalidAPIKeyError)
    async def invalid_api_key_handler(
        request: Request, exc: InvalidAPIKeyError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=401,
            content={"success": False, "error": {"message": str(exc), "code": "UNAUTHORIZED"}},
        )

    @app.exception_handler(KeyNotFoundError)
    async def key_not_found_handler(request: Request, exc: KeyNotFoundError) -> JSONResponse:
        return JSONResponse(
            status_code=404,
            content={"success": False, "error": {"message": str(exc), "code": "NOT_FOUND"}},
        )

    @app.exception_handler(FileTooLargeError)
    async def file_too_large_handler(request: Request, exc: FileTooLargeError) -> JSONResponse:
        return JSONResponse(
            status_code=413,
            content={"success": False, "error": {"message": str(exc), "code": "FILE_TOO_LARGE"}},
        )

    @app.exception_handler(UnsupportedMimeTypeError)
    async def unsupported_mime_handler(
        request: Request, exc: UnsupportedMimeTypeError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=415,
            content={
                "success": False,
                "error": {"message": str(exc), "code": "UNSUPPORTED_MEDIA_TYPE"},
            },
        )

    @app.exception_handler(InvalidFormatError)
    async def invalid_format_handler(
        request: Request, exc: InvalidFormatError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "error": {"message": str(exc), "code": "VALIDATION_ERROR"},
            },
        )

    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
        return JSONResponse(
            status_code=429,
            content={"success": False, "error": {"message": str(exc), "code": "RATE_LIMITED"}},
        )

    @app.exception_handler(JWTError)
    async def jwt_error_handler(request: Request, exc: JWTError) -> JSONResponse:
        return JSONResponse(
            status_code=401,
            content={
                "success": False,
                "error": {"message": "Invalid or expired token", "code": "UNAUTHORIZED"},
            },
        )

    @app.exception_handler(PixshiftException)
    async def pixshift_base_handler(request: Request, exc: PixshiftException) -> JSONResponse:
        log.error("unhandled_pixshift_exception", error=str(exc), path=request.url.path)
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": {"message": "An internal error occurred", "code": "INTERNAL_ERROR"},
            },
        )


app = create_app()
