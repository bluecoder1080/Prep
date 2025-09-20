import React from 'react';
import { SignIn as ClerkSignIn, SignUp as ClerkSignUp } from '@clerk/clerk-react';

// Centered Sign In Page
export const SignInPage: React.FC<{ redirectUrl?: string }> = ({ redirectUrl }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md">
        <ClerkSignIn 
          redirectUrl={redirectUrl}
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full shadow-2xl bg-white",
              headerTitle: "text-center text-gray-900",
              headerSubtitle: "text-center text-gray-600",
            },
            variables: {
              colorPrimary: "#3b82f6",
              colorBackground: "#ffffff",
              colorInputBackground: "#f8fafc",
              colorInputText: "#1e293b",
              colorText: "#1e293b",
              colorTextSecondary: "#64748b",
            }
          }}
        />
      </div>
    </div>
  );
};

// Centered Sign Up Page
export const SignUpPage: React.FC<{ redirectUrl?: string }> = ({ redirectUrl }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md">
        <ClerkSignUp 
          redirectUrl={redirectUrl}
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full shadow-2xl bg-white",
              headerTitle: "text-center text-gray-900",
              headerSubtitle: "text-center text-gray-600",
            },
            variables: {
              colorPrimary: "#3b82f6",
              colorBackground: "#ffffff",
              colorInputBackground: "#f8fafc",
              colorInputText: "#1e293b",
              colorText: "#1e293b",
              colorTextSecondary: "#64748b",
            }
          }}
        />
      </div>
    </div>
  );
};
