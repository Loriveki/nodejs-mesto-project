import { STATUS_CODES } from '../utils/constants';

class ForbiddenError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = STATUS_CODES.FORBIDDEN;
    this.name = 'ForbiddenError';
  }
}

export default ForbiddenError;
