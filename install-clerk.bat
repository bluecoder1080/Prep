@echo off
echo Installing Clerk packages for CareerCompass...

echo.
echo Installing backend Clerk package...
cd backend
call npm install @clerk/backend
if %errorlevel% neq 0 (
    echo Failed to install @clerk/backend
    pause
    exit /b 1
)

echo.
echo Installing frontend Clerk package...
cd ..\frontend
call npm install @clerk/clerk-react
if %errorlevel% neq 0 (
    echo Failed to install @clerk/clerk-react
    pause
    exit /b 1
)

echo.
echo Clerk packages installed successfully!
echo.
echo Next steps:
echo 1. Replace mock implementations in src/middleware/clerkAuth.ts
echo 2. Replace mock implementations in src/components/ClerkProvider.tsx
echo 3. Test the integration
echo.
echo See CLERK_INTEGRATION.md for detailed instructions.
pause
