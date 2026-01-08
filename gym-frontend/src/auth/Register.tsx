import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<'user' | 'elite_user'>('user');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Lütfen adınızı girin');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Lütfen geçerli bir email girin');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Kayıt başarısız');
      }
      
      alert('Kayıt başarılı! Giriş yapabilirsiniz.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
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
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formHeader}>
            <div>
              <p style={styles.label}>Kayıt</p>
              <h2 style={styles.title}>Yeni Hesap</h2>
              <p style={styles.subtitle}>Aramıza katıl, hemen başla</p>
            </div>
            <span style={styles.smallBadge}>✨ Hızlı Başlangıç</span>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.inputWrapper}>
            <span style={styles.icon}>🧑</span>
            <input
              type="text"
              placeholder="Adınız"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputWrapper}>
            <span style={styles.icon}>✉️</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.roleWrapper}>
            <label style={styles.roleLabel}>🎖️ Üyeolunacak Rol</label>
            <div style={styles.roleButtons}>
              <button
                type="button"
                onClick={() => setRole('user')}
                style={{
                  ...styles.roleButton,
                  ...(role === 'user' ? styles.roleButtonActive : {}),
                }}
              >
                <span style={styles.roleIcon}>👤</span>
                <div>
                  <div style={styles.roleTitle}>Normal Üye</div>
                  <div style={styles.roleDesc}>Grup derslerine erişim</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole('elite_user')}
                style={{
                  ...styles.roleButton,
                  ...(role === 'elite_user' ? styles.roleButtonActive : {}),
                }}
              >
                <span style={styles.roleIcon}>⭐</span>
                <div>
                  <div style={styles.roleTitle}>Elite Üye</div>
                  <div style={styles.roleDesc}>Bireysel kurslara erişim</div>
                </div>
              </button>
            </div>
          </div>

          <div style={styles.inputWrapper}>
            <span style={styles.icon}>🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputWrapper}>
            <span style={styles.icon}>🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Şifre Tekrar"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              style={styles.passwordToggle}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            style={styles.linkButton}
          >
            Zaten hesabın var mı? Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;


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
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: '#D1D5DB',
    padding: 24,
    overflow: 'hidden',
  },
  blobOne: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(34,197,94,0.14), transparent 60%)',
    filter: 'blur(40px)',
    top: 70,
    left: -80,
  },
  blobTwo: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59,130,246,0.16), transparent 60%)',
    filter: 'blur(42px)',
    bottom: -70,
    right: -50,
  },
  container: {
    width: 'min(92%, 420px)',
    padding: 30,
    borderRadius: 18,
    background: '#0c0f10',
    boxShadow: '0 20px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
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
    fontSize: 16,
    color: '#22C55E',
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 38px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#D1D5DB',
    outline: 'none',
    transition: 'box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease',
  },
  passwordToggle: {
    position: 'absolute',
    right: 8,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    color: '#22C55E',
  },
  button: {
    marginTop: 10,
    padding: '12px',
    borderRadius: 12,
    border: 'none',
    background: '#22C55E',
    color: '#050505',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 12px 28px rgba(34,197,94,0.25)',
  },
  linkButton: {
    marginTop: 6,
    background: 'transparent',
    border: 'none',
    color: '#4ADE80', 
    cursor: 'pointer',
    fontSize: 13,
  },
  error: {
    background: 'rgba(255,80,80,0.15)',
    color: '#ffb4b4',
    padding: 8,
    borderRadius: 8,
    fontSize: 13,
    textAlign: 'center',
  },
  roleWrapper: {
    marginTop: 6,
  },
  roleLabel: {
    display: 'block',
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: 600,
  },
  roleButtons: {
    display: 'flex',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    color: '#D1D5DB',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  roleButtonActive: {
    background: 'rgba(34,197,94,0.12)',
    border: '1px solid rgba(34,197,94,0.4)',
    color: '#22c55e',
  },
  roleIcon: {
    fontSize: 24,
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: 700,
    textAlign: 'left',
  },
  roleDesc: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: 'left',
  },
};
