export interface CustomError extends Error {
  status?: number;
  name: string;
  errors?: Record<string, { message: string }>;
}

export interface ValidationError extends CustomError {
  name: 'ValidationError';
  errors: Record<string, { message: string }>;
}

export interface CastError extends CustomError {
  name: 'CastError';
}
