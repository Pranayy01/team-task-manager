import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, token, fetchUser, user } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, user, fetchUser]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (token && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return children;
}
