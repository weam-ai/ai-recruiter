"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth.context';
import NotFoundPage from './NotFoundPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const [show404, setShow404] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      // User is not authenticated, show 404 after a short delay
      const timer = setTimeout(() => {
        setShow404(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (show404) {
      return (
        <div className="h-screen bg-white">
          <NotFoundPage 
            title="Access Denied"
            message="You need to be authenticated to access this page."
          />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
