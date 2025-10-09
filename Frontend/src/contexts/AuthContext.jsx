import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };

    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };

    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'REGISTER_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };

    case 'REGISTER_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getToken();
      const storedUser = localStorage.getItem('user');
      
      if (token && authService.isAuthenticated()) {
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user: userData,
                token: token
              }
            });
            return;
          } catch (error) {
            console.error('Failed to parse stored user data:', error);
          }
        }
        
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const response = await authService.getCurrentUser();
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.user,
              token: token
            }
          });
        } catch (error) {
          console.error('Token validation failed:', error);
          authService.removeToken();
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };

    if (!state.isAuthenticated) {
      initializeAuth();
    }
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      dispatch({ type: 'LOGIN_START' });

      const response = await authService.login(email, password);
      
      authService.setToken(response.token, rememberMe);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.user,
          token: response.token
        }
      });

      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const googleLogin = async (userData, token) => {
    try {
      dispatch({ type: 'LOGIN_START' });

      authService.setToken(token, true); // Remember Google users
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: userData,
          token: token
        }
      });

      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.message || 'Google login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'REGISTER_START' });

      const response = await authService.register(userData);
      
      authService.setToken(response.token);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          user: response.user,
          token: response.token
        }
      });

      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      dispatch({
        type: 'UPDATE_USER',
        payload: response.user
      });
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed';
      return { success: false, error: errorMessage };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      return { success: true, message: response.message };
    } catch (error) {
      const errorMessage = error.message || 'Password change failed';
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = (updatedUser) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: updatedUser
    });
  };

  const value = {
    ...state,
    login,
    googleLogin,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
