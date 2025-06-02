import { STATUS_CODES } from '../utils/constants';

class UnauthorizedError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = STATUS_CODES.UNAUTHORIZED;
    this.name = 'UnauthorizedError';
  }
}

export default UnauthorizedError;
