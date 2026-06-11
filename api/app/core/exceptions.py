class PixshiftException(Exception):
    """Base exception for all PixShift errors."""


class InvalidCredentialsError(PixshiftException):
    """Raised when email or password is incorrect."""


class UserAlreadyExistsError(PixshiftException):
    """Raised when trying to register with an email that already exists."""


class InvalidAPIKeyError(PixshiftException):
    """Raised when an API key is missing, invalid, or revoked."""


class KeyNotFoundError(PixshiftException):
    """Raised when an API key does not exist or belongs to another user."""


class InvalidFormatError(PixshiftException):
    """Raised when the target image format is not supported."""


class FileTooLargeError(PixshiftException):
    """Raised when the uploaded file exceeds the size limit."""


class UnsupportedMimeTypeError(PixshiftException):
    """Raised when the uploaded file's MIME type is not supported."""


class RateLimitExceeded(PixshiftException):
    """Raised when an API key exceeds its rate limit."""
