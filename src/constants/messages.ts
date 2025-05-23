export const ERROR_MESSAGES = {
  EMAIL_AND_PASSWORD_REQUIRED: "Email and password are required.",
  USER_ID_MISSING: "User ID is missing from the request.",
  EMAIL_ALREADY_EXISTS: "Email is already registered.",
  INVALID_REFRESH_TOKEN:  "Invalid or expired refresh token.",
  ACCESS_TOKEN_MISSING: "Access token is missing or invalid",
  USER_NOT_FOUND: "User not found",
  INVALID_CREDENTIALS: "Invalid email or password.",
  OTP_INVALID_OR_EXPIRED: "Invalid or expired OTP.",
  NO_REGISTRATION_DATA: "No registration data found or session expired.",
  CORRUPTED_CACHE_DATA: "Corrupted cached registration data.",
  USER_ALREADY_EXISTS: "User already exists.",
  BAD_REQUEST: "Bad request.",
  UNAUTHORIZED: "Unauthorized access.",
  FORBIDDEN: "You do not have permission to perform this action.",
  RESOURCE_NOT_FOUND: "The requested resource was not found.",
  CONFLICT_OCCURRED: "A conflict occurred with the current request.",
  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.",
};


export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESSFUL: "Login successful.",
  TOKEN_REFRESHED: "Access token refreshed successfully.",
  LOGOUT_SUCCESSFUL: "Logged out successfully.",
  PROFILE_FETCHED: "User profile fetched successfully.",
  REGISTRATION_INITIATED: "OTP sent to email. Complete registration to continue.",
  USER_REGISTERED_AND_AUTHORIZED: "User registered and authorized successfully.",
};


export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Invalid email address",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN: "Password must be at least 8 characters",
  FULL_NAME_REQUIRED: "Full name is required",
  FULL_NAME_MIN: "Full name must be at least 3 characters",
  FULL_NAME_MAX: "Full name must not exceed 30 characters",
  OTP_REQUIRED: "OTP is required",
  OTP_MIN: "OTP must be at least 6 characters",
};


