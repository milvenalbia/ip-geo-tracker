import { Navigate } from 'react-router';

const GuestRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');

  if (token) {
    return <Navigate to={'/home'} replace />;
  }

  return children;
};

export default GuestRoute;
