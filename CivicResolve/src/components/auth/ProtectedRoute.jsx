import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Skeleton from '../common/Skeleton.jsx';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      window.location.hash = '#login';
      return;
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // User is authenticated but unauthorized for this role section
      // Redirect to their respective authorized home dashboard
      if (user.role === 'AUTHORITY') {
        window.location.hash = '#authority/overview';
      } else if (user.role === 'FIELD_OFFICER') {
        window.location.hash = '#officer/tasks';
      } else {
        window.location.hash = '#citizen/dashboard';
      }
    }
  }, [isAuthenticated, loading, user, allowedRoles]);

  if (loading) {
    return <Skeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
