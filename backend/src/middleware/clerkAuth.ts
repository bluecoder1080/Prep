import { Request, Response, NextFunction } from 'express';
import { createClerkClient } from '@clerk/backend';

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Extend the Request interface to include auth
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId: string;
        orgId?: string;
      };
    }
  }
}

// Real Clerk authentication middleware
export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionToken) {
      res.status(401).json({
        success: false,
        error: 'No session token provided'
      });
      return;
    }

    // Verify the session token
    const session = await clerkClient.sessions.verifySession(sessionToken, sessionToken);

    if (!session) {
      res.status(401).json({
        success: false,
        error: 'Invalid session'
      });
      return;
    }

    // Attach auth info to request
    req.auth = {
      userId: session.userId,
      sessionId: session.id,
    };

    next();
  } catch (error) {
    console.error('Clerk authentication error:', error);
    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
    return;
  }
};

// Optional: middleware to get user info without requiring auth
export const getAuth = (req: Request, res: Response, next: NextFunction) => {
  // This will be populated by Clerk middleware if user is authenticated
  const auth = req.auth;
  
  if (auth) {
    console.log('Authenticated user:', auth.userId);
  }
  
  next();
};
