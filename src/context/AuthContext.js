import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserDB } from '../utils/database';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const currentUser = await UserDB.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking current user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      
      // Check if user already exists
      const existingUser = await UserDB.findUserByEmail(userData.email);
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' };
      }

      const existingUsername = await UserDB.findUserByUsername(userData.username);
      if (existingUsername) {
        return { success: false, error: 'Username already taken' };
      }

      // Create new user
      const result = await UserDB.createUser(userData);
      if (result.success) {
        setUser(result.user);
        return { success: true, user: result.user };
      }
      
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await UserDB.authenticateUser(email, password);
      if (result.success) {
        setUser(result.user);
      }
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await UserDB.logoutUser();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const updateUser = async (updates) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      const result = await UserDB.updateUser(user.id, updates);
      if (result.success) {
        setUser(result.user);
      }
      return result;
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
