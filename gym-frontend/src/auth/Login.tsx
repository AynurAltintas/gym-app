import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface AuthResponse {
  access_token: string;
}

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRemember(true);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/courses');
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Lütfen geçerli bir email girin');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.access_token);

      if (remember) {
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      navigate('/courses');
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.response?.data?.detail || 'Email veya şifre hatalı';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.blobOne} aria-hidden />
      <div style={styles.blobTwo} aria-hidden />

      <div style={styles.container}>
        <div style={styles.cardAccent} />
        <form onSubmit={handleSubmit} style={styles.form} aria-label="giriş formu">
          <div style={styles.formHeader}>
            <div>
              <p style={styles.label}>Giriş</p>
              <h2 style={styles.title}>Hoşgeldin</h2>
              <p style={styles.subtitle}>Hesabına giriş yap veya yeni bir hesap oluştur</p>
            </div>
            <span style={styles.smallBadge}>⚡ Güvenli Oturum</span>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.inputWrapper}>
            <span style={styles.icon} aria-hidden>
              ✉️
            </span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              autoComplete="email"
            />
          </div>

          <div style={styles.inputWrapper}>
            <span style={styles.icon} aria-hidden>
              🔒
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              style={styles.passwordToggle}
              aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div style={styles.row}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember((r) => !r)}
                style={styles.checkbox}
              />
              Beni hatırla
            </label>

            <button
              type="button"
              onClick={() => navigate('/register')}
              style={styles.linkButton}
            >
              Kayıt Ol
            </button>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? <div style={styles.spinner} /> : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;


const styles: { [key: string]: React.CSSProperties } = {
  page: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'radial-gradient(circle at 10% 20%, rgba(59,130,246,0.14), transparent 28%),\
       radial-gradient(circle at 80% 0%, rgba(34,197,94,0.16), transparent 26%),\
       linear-gradient(135deg, #050505 0%, #06120a 55%, #0f2417 100%)',
    padding: 24,
    zIndex: 9999,
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: '#D1D5DB',
    overflow: 'hidden',
  },
  blobOne: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(34,197,94,0.14), transparent 60%)',
    filter: 'blur(40px)',
    top: 60,
    left: -80,
  },
  blobTwo: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59,130,246,0.16), transparent 60%)',
    filter: 'blur(42px)',
    bottom: -60,
    right: -50,
  },
  container: {
    width: 'min(92%, 420px)',
    maxWidth: 420,
    padding: 30,
    borderRadius: 18,
    background: '#0c0f10',
    boxShadow: '0 20px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    margin: '0 auto',
    color: '#D1D5DB',
    backdropFilter: 'blur(12px)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(120deg, rgba(34,197,94,0.08), transparent 50%), linear-gradient(280deg, rgba(59,130,246,0.09), transparent 45%)',
    pointerEvents: 'none',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    position: 'relative',
    zIndex: 1,
  },
  formHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    margin: 0,
    color: '#9CA3AF',
    letterSpacing: '0.08em',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    margin: '2px 0 4px',
    fontSize: 24,
    fontWeight: 800,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 13,
    margin: '0 0 6px',
  },
  smallBadge: {
    padding: '6px 10px',
    borderRadius: 999,
    background: 'rgba(34,197,94,0.12)',
    color: '#22c55e',
    border: '1px solid rgba(34,197,94,0.3)',
    fontSize: 12,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: 10,
    color: '#22c55e', 
    fontSize: 16,
    opacity: 0.95,
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 38px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    color: '#D1D5DB',
    outline: 'none',
    transition: 'box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease',
  },
  inputFocus: {
    borderColor: 'rgba(34,197,94,0.5)',
    boxShadow: '0 0 0 3px rgba(34,197,94,0.18)',
    background: 'rgba(255,255,255,0.06)',
  },
  passwordToggle: {
    position: 'absolute',
    right: 8,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    color: '#22c55e',
    padding: 6,
    borderRadius: 6,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    gap: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    accentColor: '#22c55e', 
  },
  linkButton: { 
    background: 'transparent', 
    border: 'none', 
    color: '#22c55e', 
    cursor: 'pointer', 
    fontSize: 13, 
    fontWeight: 700 
  },
  button: {
    marginTop: 8,
    padding: '12px',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    background: '#22c55e',
    color: '#050505',
    fontWeight: 800,
    letterSpacing: '0.02em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 12px 28px rgba(59,130,246,0.25)',
  },
  spinner: {
    width: 18,
    height: 18,
    border: '3px solid rgba(0,0,0,0.1)',
    borderTopColor: '#050505',
    borderRadius: '50%',
  },
  error: {
    background: 'rgba(255,80,80,0.1)',
    color: '#ffb4b4',
    padding: 8,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 13,
    border: '1px solid rgba(255,80,80,0.2)',
  },

};
