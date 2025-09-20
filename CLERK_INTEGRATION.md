# Clerk Authentication Integration Guide

This document outlines the Clerk authentication integration for CareerCompass.

## Overview

CareerCompass now supports Clerk authentication alongside the existing JWT-based authentication system. This provides:

- Modern, secure authentication
- Social login options (Google, GitHub, etc.)
- User management dashboard
- Built-in security features
- Easy integration with React and Node.js

## Environment Variables

### Backend (.env)
```env
CLERK_SECRET_KEY=sk_test_EnsBjRokpLPdTw647Iuw1hbgSbhzHVQ6ltfQ1l7j9p
```

### Frontend (.env)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y2hlZXJmdWwtcmVkYmlyZC02MS5jbGVyay5hY2NvdW50cy5kZXYk
VITE_API_URL=http://localhost:5000/api
```

## Installation

### Backend Dependencies
```bash
cd backend
npm install @clerk/backend
```

### Frontend Dependencies
```bash
cd frontend
npm install @clerk/clerk-react
```

## Implementation Status

### ✅ Completed
- [x] Environment variables configured
- [x] User model updated to support Clerk ID
- [x] Mock Clerk middleware for development
- [x] Clerk auth routes created
- [x] Frontend Clerk provider setup
- [x] Navigation updated with auth buttons
- [x] Sign-in/Sign-up routes added

### 🚧 To Complete After Package Installation

1. **Install Clerk packages** (run the npm install commands above)

2. **Update backend middleware** - Replace mock implementation in `src/middleware/clerkAuth.ts`:
```typescript
import { ClerkExpressRequireAuth } from '@clerk/backend';

export const requireAuth = ClerkExpressRequireAuth({
  onError: (error) => {
    console.error('Clerk authentication error:', error);
    return {
      status: 401,
      message: 'Unauthorized: Invalid or missing authentication'
    };
  }
});
```

3. **Update frontend provider** - Replace mock implementation in `src/components/ClerkProvider.tsx`:
```typescript
import { ClerkProvider as ClerkProviderBase, useAuth, useUser, SignIn, SignUp, UserButton } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const ClerkProvider = ({ children }) => (
  <ClerkProviderBase publishableKey={PUBLISHABLE_KEY}>
    {children}
  </ClerkProviderBase>
);

// Export the real hooks and components
export { useAuth, useUser, SignIn, SignUp, UserButton };
```

## Database Schema Updates

The User model now supports both traditional and Clerk authentication:

```typescript
interface IUser {
  name: string;
  email: string;
  passwordHash?: string; // Optional for Clerk users
  clerkId?: string; // Clerk user ID
  role: 'student' | 'admin';
  // ... other fields
}
```

## API Endpoints

### Clerk Authentication Routes (`/api/clerk-auth`)

- `GET /me` - Get current user profile
- `POST /sync-user` - Sync user data from Clerk
- `DELETE /delete-account` - Delete user account

### Traditional Authentication Routes (`/api/auth`)

- `POST /register` - Register with email/password
- `POST /login` - Login with email/password
- `POST /refresh` - Refresh JWT token
- `POST /logout` - Logout
- `POST /logout-all` - Logout from all devices

## Frontend Routes

- `/sign-in` - Clerk sign-in page
- `/sign-up` - Clerk sign-up page
- All existing routes remain unchanged

## Migration Strategy

1. **Dual Authentication Support**: Both Clerk and JWT authentication work simultaneously
2. **Gradual Migration**: Users can continue using existing accounts
3. **User Choice**: New users can choose between Clerk or traditional registration

## Security Features

- JWT tokens for traditional auth
- Clerk session management for Clerk users
- Rate limiting on all auth endpoints
- Secure password hashing for traditional users
- CORS configuration for frontend integration

## Development vs Production

### Development (Current State)
- Mock Clerk components for development
- Traditional authentication fully functional
- Clerk integration ready for package installation

### Production Setup
1. Install Clerk packages
2. Replace mock implementations
3. Configure Clerk dashboard
4. Set up webhooks for user sync
5. Configure social login providers

## Testing

After installing Clerk packages, test:

1. **Traditional Auth**: Existing registration/login flows
2. **Clerk Auth**: New sign-up/sign-in flows
3. **User Sync**: Clerk user data synchronization
4. **Navigation**: Auth state in header navigation
5. **Protected Routes**: Access control with both auth methods

## Next Steps

1. Install Clerk packages using the npm commands above
2. Replace mock implementations with real Clerk components
3. Test the integration thoroughly
4. Configure Clerk dashboard settings
5. Set up webhooks for real-time user synchronization

## Support

For issues with Clerk integration:
- Check Clerk documentation: https://clerk.com/docs
- Verify environment variables are set correctly
- Ensure packages are installed properly
- Check console for authentication errors

---

**Note**: The current implementation uses mock Clerk components to allow development without package installation. Install the Clerk packages and update the implementations to enable full functionality.
