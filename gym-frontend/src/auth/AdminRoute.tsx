import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

type Props = {
  children: any;
};

const AdminRoute = ({ children }: Props) => {
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
      .then((res) => {
        if (!mounted) return;

        if (res.data.role !== 'admin') {
          setStatus('unauth');
        } else {
          setStatus('ok');
        }
      })
      .catch(() => {
        if (!mounted) return;
        localStorage.removeItem('token');
        setStatus('unauth');
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (status === 'verifying') return null; 
  if (status === 'unauth') return <Navigate to="/courses" replace />;

  return <>{children}</>;
};

export default AdminRoute;
