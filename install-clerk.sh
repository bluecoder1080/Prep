#!/bin/bash

echo "Installing Clerk packages for CareerCompass..."

echo ""
echo "Installing backend Clerk package..."
cd backend
npm install @clerk/backend
if [ $? -ne 0 ]; then
    echo "Failed to install @clerk/backend"
    exit 1
fi

echo ""
echo "Installing frontend Clerk package..."
cd ../frontend
npm install @clerk/clerk-react
if [ $? -ne 0 ]; then
    echo "Failed to install @clerk/clerk-react"
    exit 1
fi

echo ""
echo "Clerk packages installed successfully!"
echo ""
echo "Next steps:"
echo "1. Replace mock implementations in src/middleware/clerkAuth.ts"
echo "2. Replace mock implementations in src/components/ClerkProvider.tsx"
echo "3. Test the integration"
echo ""
echo "See CLERK_INTEGRATION.md for detailed instructions."
