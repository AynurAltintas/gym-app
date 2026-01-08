import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

interface User {
  id: number;
  email: string;
  role: 'user' | 'admin' | 'trainer';
}

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    api
      .get('/users/profile')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <NavLink to="/" className="logo">
          <span style={{ marginRight: 6, display: 'inline-block' }}>🍃</span>
          RUTİN
        </NavLink>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <NavLink to="/courses" className="nav-link">
              Kurslar
            </NavLink>

            <NavLink to="/profile" className="nav-link">
              Profil
            </NavLink>

            {user.role === 'admin' && (
              <NavLink to="/admin" className="nav-link nav-link-admin">
                Admin
              </NavLink>
            )}

            <button onClick={logout} className="logout-btn">
              Çıkış
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">
              Giriş
            </NavLink>
            <NavLink to="/register" className="nav-link">
              Kayıt Ol
            </NavLink>
          </>
        )}
      </div>
      <style>{`
.navbar {
  width: 100%;
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0a0a0a;
  border-bottom: 1px solid rgba(34, 197, 94, 0.15);
  box-sizing: border-box;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #f8fafc;
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: color 0.2s ease;
}

.logo:hover {
  color: #4ade80;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nav-link {
  color: #e5e7eb;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  transition: 0.3s ease;
}

.nav-link:hover {
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
}

.nav-link.active {
  background: linear-gradient(90deg, #22c55e, #84cc16);
  color: #050505;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
}

.nav-link-admin {
  border: 1px solid rgba(34, 197, 94, 0.4);
  background: rgba(34, 197, 94, 0.05);
  color: #22c55e;
  font-weight: 600;
}

.nav-link-admin:hover {
  background: rgba(34, 197, 94, 0.15);
  border-color: #22c55e;
  color: #4ade80;
}

.nav-link-admin.active {
  background: linear-gradient(90deg, #22c55e, #84cc16);
  color: #050505;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.logout-btn {
  background: #ef4444;
  border: none;
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  opacity: 0.9;
}

.logout-btn:hover {
  background: #dc2626;
  opacity: 1;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

@media (max-width: 600px) {
  .nav-right {
    gap: 8px;
  }

  .nav-link {
    font-size: 13px;
    padding: 5px 8px;
  }
}
      `}</style>
    </nav>
  );
};

export default Navbar;
