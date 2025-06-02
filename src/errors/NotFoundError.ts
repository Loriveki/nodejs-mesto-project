import { STATUS_CODES } from '../utils/constants';

class NotFoundError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = STATUS_CODES.NOT_FOUND;
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
