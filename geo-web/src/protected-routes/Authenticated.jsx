import { Navigate } from 'react-router';

const Authenticated = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to={'/'} replace />;
  }

  return children;
};

export default Authenticated;
