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
    try {
      const saved = localStorage.getItem('smartqr_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
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
    const cleanEmail = email.trim().toLowerCase();
    try {
      if (isLiveSupabase) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (data) {
          const logged: UserProfile = {
            id: data.id,
            email: data.email,
            full_name: data.full_name || cleanEmail.split('@')[0],
            role: (data.role as UserRole) || preferredRole,
            avatar_url: data.avatar_url,
            phone: data.phone
          };
          setUser(logged);
          return;
        }
      }
      
      // If profile does not exist yet in Supabase or offline, register it now
      await register(cleanEmail, cleanEmail.split('@')[0], preferredRole);
    } catch (err) {
      console.error('Auth login error:', err);
      // Fallback local session
      const fallbackUser: UserProfile = {
        id: generateId(),
        email: cleanEmail,
        full_name: cleanEmail.split('@')[0],
        role: preferredRole
      };
      setUser(fallbackUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, fullName: string, role: UserRole = 'restaurant_owner'): Promise<UserProfile> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim() || cleanEmail.split('@')[0];

    try {
      // 1. Check if profile already exists in Supabase
      if (isLiveSupabase) {
        const { data: existing } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (existing) {
          const existingUser: UserProfile = {
            id: existing.id,
            email: existing.email,
            full_name: existing.full_name || cleanName,
            role: (existing.role as UserRole) || role,
            avatar_url: existing.avatar_url,
            phone: existing.phone
          };
          setUser(existingUser);
          return existingUser;
        }
      }

      // 2. Create new profile with a valid RFC4122 UUID
      const newUserId = generateId();
      const newUser: UserProfile = {
        id: newUserId,
        email: cleanEmail,
        full_name: cleanName,
        role
      };

      if (isLiveSupabase) {
        const { error } = await supabase.from('profiles').upsert({
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role
        });
        if (error) {
          console.warn('Supabase profile upsert warning (please run supabase_master_setup.sql in Supabase):', error.message);
        }
      }

      setUser(newUser);
      return newUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isLiveSupabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignore
      }
    }
    setUser(null);
  };

  const changePassword = async (newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isLiveSupabase) {
        try {
          await supabase.auth.updateUser({ password: newPassword });
        } catch (err) {
          console.warn('Supabase password update error:', err);
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
