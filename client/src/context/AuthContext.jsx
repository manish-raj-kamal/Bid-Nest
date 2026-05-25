import { useState } from 'react';
import { AuthContext } from './auth';
import { apiRequest } from '../utils/api';

const getStoredUser = () => {
  const stored = localStorage.getItem('bidnest_user');
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem('bidnest_user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const loading = false;

  const login = async (email, password) => {
    const data = await apiRequest('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setUser(data);
    localStorage.setItem('bidnest_user', JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password) => {
    const data = await apiRequest('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    // Do NOT set user or localStorage yet, as they need to verify OTP
    return data;
  };

  const verifyOtp = async (email, otp) => {
    const data = await apiRequest('/api/users/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    setUser(data);
    localStorage.setItem('bidnest_user', JSON.stringify(data));
    return data;
  };

  const resendOtp = async (email) => {
    const data = await apiRequest('/api/users/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return data;
  };

  const googleLogin = async (credential) => {
    const data = await apiRequest('/api/users/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    setUser(data);
    localStorage.setItem('bidnest_user', JSON.stringify(data));
    return data;
  };

  const forgotPassword = async (email) => {
    const data = await apiRequest('/api/users/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return data;
  };

  const resetPassword = async (email, otp, newPassword) => {
    const data = await apiRequest('/api/users/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bidnest_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, resendOtp, googleLogin, forgotPassword, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
