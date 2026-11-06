import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types';
import { supabase, isLiveSupabase, generateId } from '@/lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  register: (email: string, fullName: string, role?: UserRole) => Promise<UserProfile>;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => void;
  changePassword: (newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('smartqr_current_user');
    return saved ? JSON.parse(saved) : null;
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
        const { data } = await supabase.from('profiles').select('*').eq('email', email.toLowerCase()).maybeSingle();
        if (data) {
          const logged: UserProfile = {
            id: data.id,
            email: data.email,
            full_name: data.full_name || email.split('@')[0],
            role: (data.role as UserRole) || preferredRole,
            avatar_url: data.avatar_url,
            phone: data.phone
          };
          setUser(logged);
          return;
        }
      }
      
      const loggedUser: UserProfile = {
        id: generateId(),
        email,
        full_name: email.split('@')[0],
        role: preferredRole
      };
      setUser(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, fullName: string, role: UserRole = 'restaurant_owner'): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const newUser: UserProfile = {
        id: generateId(),
        email: email.trim(),
        full_name: fullName.trim(),
        role
      };
      setUser(newUser);
      localStorage.setItem('smartqr_current_user', JSON.stringify(newUser));

      if (isLiveSupabase) {
        supabase.from('profiles').upsert({
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role
        }).then(({ error }) => {
          if (error) console.warn('Supabase profile upsert error:', error.message);
        });
      }

      return newUser;
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

  const changePassword = async (newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isLiveSupabase) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          console.warn('Supabase password update error:', error.message);
        }
      }
      if (user?.email) {
        localStorage.setItem(`smartqr_owner_password_${user.email.toLowerCase()}`, newPassword);
      }
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
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
        switchRole,
        changePassword
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
