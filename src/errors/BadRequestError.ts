import { STATUS_CODES } from '../utils/constants';

class BadRequestError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = STATUS_CODES.BAD_REQUEST;
    this.name = 'BadRequestError';
  }
}

export default BadRequestError;
