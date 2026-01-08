import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

type Props = {
  children: any;
};

const PrivateRoute = ({ children }: Props) => {
  const [status, setStatus] = useState<'verifying' | 'ok' | 'unauth'>('verifying');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('unauth');
      return;
    }

    let mounted = true;
    api
      .get('/users/profile')
      .then(() => {
        if (!mounted) return;
        setStatus('ok');
      })
      .catch(() => {
        if (!mounted) return;
        try {
          localStorage.removeItem('token');
        } catch (e) {}
        setStatus('unauth');
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (status === 'verifying') return null; // or a spinner
  if (status === 'unauth') return <Navigate to="/login" replace />;
  return children;
};

export default PrivateRoute;
