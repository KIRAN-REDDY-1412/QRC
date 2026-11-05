import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types';
import { supabase, isLiveSupabase } from '@/lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  register: (email: string, fullName: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, UserProfile> = {
  super_admin: {
    id: 'user-super-admin',
    email: 'admin@smartqrmenu.in',
    full_name: 'Rajesh Sharma (Platform Admin)',
    role: 'super_admin',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  },
  restaurant_owner: {
    id: 'user-owner-1',
    email: 'vikram@saffrondarbar.in',
    full_name: 'Vikram Malhotra',
    role: 'restaurant_owner',
    phone: '+91 98200 12345',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  customer: {
    id: 'user-guest',
    email: 'guest@smartqrmenu.in',
    full_name: 'Dining Guest',
    role: 'customer'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('smartqr_current_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.restaurant_owner;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('smartqr_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smartqr_current_user');
    }
  }, [user]);

  const login = async (email: string, preferredRole: UserRole = 'restaurant_owner') => {
    setIsLoading(true);
    try {
      if (isLiveSupabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: 'Password123!'
        });
        if (error) {
          console.warn('Supabase Auth error, using fallback demo session:', error.message);
        }
      }
      
      const matched = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
      const loggedUser = matched || {
        id: `user-${Date.now()}`,
        email,
        full_name: email.split('@')[0],
        role: preferredRole
      };
      setUser(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, fullName: string, role: UserRole = 'restaurant_owner') => {
    setIsLoading(true);
    try {
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        email,
        full_name: fullName,
        role
      };
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isLiveSupabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    setUser(DEMO_USERS[newRole]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'customer',
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
