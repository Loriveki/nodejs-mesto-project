const urlRegex = /^(https?:\/\/)(www\.)?[0-9a-zA-Z-]+\.[a-zA-Z]+(\/[0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]*#?)?$/;

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export default urlRegex;
