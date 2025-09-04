"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { IronSessionData } from '@/types/weamuser';

interface User {
  _id: string;
  email: string;
  name?: string;
  companyId?: string;
  access_token?: string;
  refresh_token?: string;
  isProfileUpdated?: boolean;
  roleCode?: string;
}

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user from session on mount
  useEffect(() => {
    loadUserFromSession();
  }, []);

  const loadUserFromSession = async () => {
    try {
      setIsLoaded(false);
      
      // Fetch user data from session API
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const sessionData = await response.json();
        if (sessionData.user) {
          setUser(sessionData.user);
        } else {
          console.log('No user data in session');
          setUser(null);
          // Clear any old cookies that might be causing issues
          clearOldCookies();
        }
      } else {
        console.log('No active session found');
        setUser(null);
        // Clear any old cookies that might be causing issues
        clearOldCookies();
      }
    } catch (error) {
      console.error('Error loading user session:', error);
      setUser(null);
      // Clear any old cookies that might be causing issues
      clearOldCookies();
    } finally {
      setIsLoaded(true);
    }
  };

  const clearOldCookies = () => {
    if (typeof window !== 'undefined') {
      // Clear old authentication cookies
      document.cookie = 'foloup_auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'iron-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  };

  const refreshUser = async () => {
    await loadUserFromSession();
  };

  const signOut = async () => {
    try {
      // Call logout API to clear server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      // Clear old cookies
      clearOldCookies();
      // Redirect to home page
      window.location.href = '/';
    }
  };

  const value: AuthContextType = {
    user,
    isLoaded,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Convenience hooks that match Clerk's API
export function useUser() {
  const { user, isLoaded } = useAuth();
  return { user, isLoaded };
}

export function useOrganization() {
  const { user } = useAuth();
  // Create organization object from user's companyId
  return { 
    organization: user?.companyId ? {
      id: user.companyId,
      name: `${user.name || user.email}'s Company`,
      imageUrl: "/FoloUp.png"
    } : null 
  };
}

export function useClerk() {
  const { user, signOut } = useAuth();
  return { 
    user, 
    signOut,
    // Add other methods as needed
  };
}
