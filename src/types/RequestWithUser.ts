import { Request } from 'express';
import { ObjectId } from 'mongoose';

export interface RequestWithUser extends Request {
  user: {
    _id: string | ObjectId;
  };
}
