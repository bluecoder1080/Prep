import { Request, Response, NextFunction } from 'express';
import { requireAuth } from './clerkAuth';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
  auth?: {
    userId: string;
    sessionId: string;
    orgId?: string;
  };
}

// Use Clerk authentication as the main authenticate middleware
export const authenticate = requireAuth;

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Access denied. Authentication required.' 
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
      return;
    }

    next();
  };
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  // For optional auth with Clerk, just continue without authentication
  // The route can check if req.auth exists from Clerk middleware
  next();
};
