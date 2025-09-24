import { Navigate } from 'react-router';
import { authStore } from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = authStore();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute