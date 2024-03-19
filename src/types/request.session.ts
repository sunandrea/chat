import { Request } from 'express';

export interface RequestWithSession extends Request {
  user: {
    email: string;
    id: string;
  };
}
