import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App';
import Chat from './pages/Chat';
import Psychotest from './pages/Psychotest';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Resume from './pages/Resume';
import { ClerkProvider } from './components/ClerkProvider';
import { SignInPage, SignUpPage } from './components/AuthPages';

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Landing /> },
    { path: 'chat', element: <Chat /> },
    { path: 'psychotest', element: <Psychotest /> },
    { path: 'profile', element: <Profile /> },
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'resume', element: <Resume /> },
  ]},
  // Auth pages outside of App layout for proper centering
  { path: 'sign-in', element: <SignInPage redirectUrl="/dashboard" /> },
  { path: 'sign-up', element: <SignUpPage redirectUrl="/dashboard" /> },
]);

const qc = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider>
      <QueryClientProvider client={qc}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>
);
