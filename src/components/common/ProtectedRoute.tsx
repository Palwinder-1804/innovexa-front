import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

interface ProtectedRouteProps {
  allowedRoles?: Array<'STUDENT' | 'INSTRUCTOR' | 'BUSINESS' | 'ADMIN'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
        <p className="text-gray-400 font-display text-sm">Authenticating secure session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Re-route to their matching home dashboard if accessing unauthorized pages
    return <Navigate to={`/dashboard/${user.role.toLowerCase()}`} replace />;
  }

  return <Outlet />;
};
