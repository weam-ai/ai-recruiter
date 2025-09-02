"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AUTH_USERS, SESSION_KEY, DEFAULT_SIGN_OUT_REDIRECT } from '@/lib/auth-constants';

interface User {
  id: string;
  email: string;
  name: string;
  organization: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(true); // Start as loaded

  // Load user from session on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        if (typeof window !== 'undefined') {
          const session = localStorage.getItem(SESSION_KEY);
          if (session) {
            const userData = JSON.parse(session);
            setUser(userData);
            // Set session cookie for middleware
            document.cookie = `foloup_auth_session=true; path=/; max-age=86400`;
          }
        }
      } catch (error) {
        console.error('Error loading user session:', error);
        localStorage.removeItem(SESSION_KEY);
        document.cookie = `foloup_auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const user = AUTH_USERS.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = user;
      
      setUser(userWithoutPassword);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword));
        // Set a simple session cookie for middleware
        document.cookie = `foloup_auth_session=true; path=/; max-age=86400`; // 24 hours
      }

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An error occurred during sign in' };
    }
  };

  const signOut = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
      // Clear session cookie
      document.cookie = `foloup_auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      window.location.href = DEFAULT_SIGN_OUT_REDIRECT;
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    // For this demo, we'll just check if the email already exists
    const existingUser = AUTH_USERS.find(u => u.email === email);
    
    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    // In a real app, you would create a new user here
    // For demo purposes, we'll just return an error
    return { success: false, error: 'Registration is not available in demo mode. Please use existing credentials.' };
  };

  const value: AuthContextType = {
    user,
    isLoaded,
    signIn,
    signOut,
    signUp,
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
  return { organization: user?.organization || null };
}

export function useClerk() {
  const { user, signOut } = useAuth();
  return { 
    user, 
    signOut,
    // Add other methods as needed
  };
}
