import React from 'react';
import { 
  ClerkProvider as ClerkProviderBase, 
  useAuth, 
  useUser, 
  SignIn, 
  SignUp, 
  UserButton 
} from '@clerk/clerk-react';

interface ClerkProviderProps {
  children: React.ReactNode;
}

const PUBLISHABLE_KEY = (import.meta as any).env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

// Real Clerk Provider with custom appearance
export const ClerkProvider: React.FC<ClerkProviderProps> = ({ children }) => {
  return (
    <ClerkProviderBase 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        elements: {
          rootBox: "flex justify-center items-center min-h-screen",
          card: "w-full max-w-md mx-auto",
          headerTitle: "text-center",
          headerSubtitle: "text-center",
        },
        variables: {
          colorPrimary: "#3b82f6", // Blue to match your theme
        }
      }}
    >
      {children}
    </ClerkProviderBase>
  );
};

// Export the real hooks and components
export { useAuth, useUser, SignIn, SignUp, UserButton };
