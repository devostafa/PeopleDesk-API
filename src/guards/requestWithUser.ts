import { Request } from 'express';
import { UserRole } from '../data/enums/userRole';

export interface RequestWithUser extends Request {
  user: {
    sub: string;
    role: UserRole;
  };
}
