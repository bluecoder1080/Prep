import { Link, Outlet, useLocation } from 'react-router-dom';
import { UserButton, useAuth } from './components/ClerkProvider';

export default function App() {
  const loc = useLocation();
  const { isSignedIn } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100">
      {/* Cleaner, more minimal header */}
      <header className="border-b border-slate-700/50 sticky top-0 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with better typography */}
            <Link to="/" className="text-xl font-semibold text-white tracking-tight">
              Career<span className="text-blue-400">Compass</span>
            </Link>
            
            {/* Navigation and Auth */}
            <div className="flex items-center space-x-8">
              {/* Cleaner navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link 
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    loc.pathname === '/' ? 'text-white' : 'text-gray-300'
                  }`} 
                  to="/"
                >
                  Home
                </Link>
                <Link 
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    loc.pathname.startsWith('/chat') ? 'text-white' : 'text-gray-300'
                  }`} 
                  to="/chat"
                >
                  AI Chat
                </Link>
                <Link 
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    loc.pathname.startsWith('/psychotest') ? 'text-white' : 'text-gray-300'
                  }`} 
                  to="/psychotest"
                >
                  Assessment
                </Link>
                <Link 
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    loc.pathname.startsWith('/profile') ? 'text-white' : 'text-gray-300'
                  }`} 
                  to="/profile"
                >
                  Profile
                </Link>
                <Link 
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    loc.pathname.startsWith('/dashboard') ? 'text-white' : 'text-gray-300'
                  }`} 
                  to="/dashboard"
                >
                  Dashboard
                </Link>
                <Link 
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    loc.pathname.startsWith('/resume') ? 'text-white' : 'text-gray-300'
                  }`} 
                  to="/resume"
                >
                  Resume
                </Link>
              </nav>
              
              {/* Auth Section */}
              <div className="flex items-center space-x-4">
                {isSignedIn ? (
                  <UserButton />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link 
                      to="/sign-in" 
                      className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/sign-up" 
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content with better spacing */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
}
