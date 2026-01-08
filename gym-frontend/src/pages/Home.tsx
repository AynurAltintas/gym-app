import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const goCourses = () => navigate('/courses');

  return (
    <div style={styles.page}>
      <div style={styles.blobOne} aria-hidden />
      <div style={styles.blobTwo} aria-hidden />

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.badge}>Yeni sezon kayıtları açık</div>

        <h1 style={styles.title}>
          RUTİN Spor Kompleksi
        </h1>

        <p style={styles.subtitle}>
          Fonksiyonel antrenman, yoga, dövüş sporları ve kişiye özel programlarla
          modern bir spor deneyimi. Tek tıkla kaydol, hedeflerine birlikte ulaşalım.
        </p>

        <div style={styles.buttons}>
          <button type="button" onClick={() => navigate('/register')} style={styles.primary}>
            Hemen Başla
          </button>
          <button type="button" onClick={goCourses} style={styles.secondary}>
            Kursları Keşfet
          </button>
        </div>
      </section>

      {/* ÖNE ÇIKANLAR */}
      <section style={styles.featuresSection}>
        <header style={styles.sectionHeader}>
          <div>
            <p style={styles.kicker}>Programlar</p>
            <h2 style={styles.sectionTitle}>Her hedefe uygun dersler</h2>
            <p style={styles.sectionSubtitle}>
              Güç, esneklik, dayanıklılık ve mental denge için tasarlanmış ders portföyü.
            </p>
          </div>
        </header>

        <div style={styles.featureGrid}>
          {features.map((feature) => (
            <article
              key={feature.title}
              style={{
                ...styles.featureCard,
                border: `1px solid ${feature.color}33`,
              }}
            >
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={{ ...styles.featureTitle, color: feature.color }}>{feature.title}</h3>
              <p style={styles.featureText}>{feature.text}</p>
              <div
                style={{
                  ...styles.pill,
                  background: `${feature.color}20`,
                  color: feature.color,
                  border: `1px solid ${feature.color}55`,
                }}
              >
                {feature.pill}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ROL & ERİŞİM */}
      <section style={styles.accessSection}>
        <header style={styles.sectionHeader}>
          <div>
            <p style={styles.kicker}>Roller & Erişim</p>
            <h2 style={styles.sectionTitle}>Hangi rolde hangi dersler?</h2>
            <p style={styles.sectionSubtitle}>
              Normal üyeler grup derslerine, Elite üyeler bireysel + grup derslerine erişir. Admin tüm kayıtları yönetir.
            </p>
          </div>
        </header>

        <div style={styles.accessGrid}>
          {accessCards.map((card) => (
            <article key={card.title} style={styles.accessCard}>
              <div style={{ ...styles.accessBadge, color: card.accent, borderColor: `${card.accent}55` }}>
                {card.badge}
              </div>
              <h3 style={{ ...styles.accessTitle, color: card.accent }}>{card.title}</h3>
              <ul style={styles.accessList}>
                {card.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <button
                style={{ ...styles.ghostButton, borderColor: `${card.accent}66`, color: card.accent }}
                onClick={() => navigate(card.to)}
              >
                {card.cta}
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* NEDEN RUTİN */}
      <section style={styles.splitSection}>
        <div style={styles.splitCard}>
          <p style={styles.kicker}>Neden RUTİN?</p>
          <h2 style={styles.sectionTitle}>Bilimsel yaklaşım, güçlü topluluk</h2>
          <ul style={styles.list}>
            <li>📊 Programlar, kapasite ve anlık doluluk görünürlüğü</li>
            <li>💬 Eğitmenlerden kişisel geri bildirim ve takip</li>
            <li>🔒 Üyelik & kayıt işlemlerinde güvenli altyapı</li>
            <li>⏱️ Esnek ders saatleri ve kolay kayıt/iptal</li>
          </ul>
          <div style={styles.inlineCtas}>
            <button style={styles.primarySmall} onClick={() => navigate('/register')}>
              Kayıt Ol
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    title: 'Grup Dersleri',
    text: 'Fonksiyonel güç, HIIT, yoga ve kardiyo grup seansları; herkes için erişilebilir.',
    icon: '👥',
    pill: 'Tüm Üyeler',
    color: '#22c55e',
  },
  {
    title: 'Bireysel Dersler',
    text: 'Elite üyeler için 1-1 programlar, eğitmen eşliğinde kişiye özel içerik.',
    icon: '⭐',
    pill: 'Elite Üye',
    color: '#a855f7',
  },
];

const accessCards = [
  {
    title: 'Normal Üye',
    accent: '#22c55e',
    badge: 'Grup Dersleri',
    points: [
      'Grup derslerine kayıt',
      'Doluluk takibi',
      'Eğitmen profilleri',
    ],
    cta: 'Grup derslerini gör',
    to: '/courses',
  },
  {
    title: 'Elite Üye',
    accent: '#a855f7',
    badge: 'Bireysel + Grup',
    points: [
      'Bireysel derslere erişim',
      'Öncelikli kontenjan',
      '1-1 eğitmen takibi',
    ],
    cta: 'Bireysel dersleri keşfet',
    to: '/courses',
  },
];

export default Home;

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at 10% 20%, rgba(59,130,246,0.14), transparent 28%),\
       radial-gradient(circle at 80% 0%, rgba(34,197,94,0.16), transparent 26%),\
       linear-gradient(135deg, #050505, #0a0f0d 55%, #0f2417)',
    color: '#e5e7eb',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  blobOne: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(34,197,94,0.14), transparent 60%)',
    filter: 'blur(48px)',
    top: 80,
    left: -110,
  },
  blobTwo: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59,130,246,0.16), transparent 60%)',
    filter: 'blur(46px)',
    bottom: -120,
    right: -80,
  },
  hero: {
    padding: '120px 24px 64px',
    maxWidth: 1200,
    margin: '0 auto',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    borderRadius: 999,
    background: 'rgba(34,197,94,0.12)',
    color: '#22c55e',
    fontWeight: 600,
    fontSize: 13,
    letterSpacing: 0.2,
    marginBottom: 16,
  },
  title: {
    fontSize: '52px',
    lineHeight: 1.05,
    fontWeight: 900,
    color: '#f8fafc',
    letterSpacing: '-0.03em',
  },
  subtitle: {
    fontSize: 18,
    maxWidth: 760,
    margin: '18px auto 28px',
    color: '#94a3b8',
    lineHeight: 1.7,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: 14,
    marginTop: 10,
  },
  primary: {
    padding: '14px 26px',
    borderRadius: 14,
    background: '#22c55e',
    color: '#050505',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 800,
    letterSpacing: '-0.01em',
    boxShadow: '0 10px 30px rgba(34,197,94,0.25)',
  },
  secondary: {
    padding: '14px 26px',
    borderRadius: 14,
    background: 'transparent',
    color: '#22c55e',
    border: '1px solid rgba(34,197,94,0.5)',
    cursor: 'pointer',
    fontWeight: 700,
  },
  featuresSection: {
    maxWidth: 1180,
    margin: '0 auto',
    padding: '32px 24px 80px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 20,
  },
  kicker: {
    color: '#22c55e',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontSize: 12,
    marginBottom: 6,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    margin: 0,
  },
  sectionSubtitle: {
    color: '#94a3b8',
    marginTop: 6,
    maxWidth: 620,
    lineHeight: 1.6,
  },
  ghostButton: {
    padding: '12px 16px',
    borderRadius: 12,
    border: '1px solid rgba(148,163,184,0.3)',
    background: 'transparent',
    color: '#e5e7eb',
    cursor: 'pointer',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 18,
  },
  accessSection: {
    maxWidth: 1180,
    margin: '0 auto',
    padding: '16px 24px 96px',
  },
  accessGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 16,
  },
  accessCard: {
    borderRadius: 16,
    padding: 18,
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'linear-gradient(160deg, rgba(8,12,14,0.9), rgba(11,17,21,0.9))',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },
  accessBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.1)',
    fontWeight: 700,
    fontSize: 12,
    marginBottom: 10,
  },
  accessTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 800,
    margin: '2px 0 8px',
  },
  accessList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 14px',
    color: '#cbd5e1',
    display: 'grid',
    gap: 8,
    lineHeight: 1.5,
  },
  featureCard: {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
    border: '1px solid rgba(34,197,94,0.1)',
    borderRadius: 16,
    padding: 18,
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
  },
  featureIcon: {
    fontSize: 26,
    marginBottom: 8,
  },
  featureTitle: {
    color: '#f8fafc',
    margin: '6px 0 6px',
    fontSize: 18,
    fontWeight: 700,
  },
  featureText: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 1.6,
  },
  pill: {
    display: 'inline-block',
    marginTop: 10,
    padding: '6px 12px',
    borderRadius: 999,
    background: 'rgba(34,197,94,0.12)',
    color: '#22c55e',
    fontWeight: 700,
    fontSize: 12,
  },
  splitSection: {
    maxWidth: 1180,
    margin: '0 auto',
    padding: '0 24px 120px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 20,
  },
  splitCard: {
    borderRadius: 18,
    padding: 24,
    border: '1px solid rgba(34,197,94,0.12)',
    background: 'rgba(255,255,255,0.02)',
    boxShadow: '0 14px 36px rgba(0,0,0,0.35)',
    position: 'relative',
    overflow: 'hidden',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '18px 0',
    color: '#cbd5e1',
    lineHeight: 1.7,
    display: 'grid',
    gap: 6,
  },
  inlineCtas: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 12,
  },
  primarySmall: {
    padding: '12px 16px',
    borderRadius: 12,
    background: '#22c55e',
    color: '#050505',
    border: 'none',
    fontWeight: 800,
    cursor: 'pointer',
  },
  secondarySmall: {
    padding: '12px 16px',
    borderRadius: 12,
    background: 'transparent',
    color: '#22c55e',
    border: '1px solid rgba(34,197,94,0.5)',
    fontWeight: 700,
    cursor: 'pointer',
  },
  highlightCard: {
    borderRadius: 18,
    padding: 22,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'radial-gradient(circle at 20% 20%, rgba(34,197,94,0.12), rgba(5,5,5,0.9))',
    boxShadow: '0 14px 36px rgba(0,0,0,0.35)',
    position: 'relative',
    overflow: 'hidden',
  },
  highlightBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: 999,
    background: 'rgba(239,68,68,0.12)',
    color: '#ef4444',
    fontWeight: 700,
    fontSize: 12,
    marginBottom: 10,
  },
  highlightTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: 800,
    margin: '6px 0',
  },
  highlightDesc: {
    color: '#cbd5e1',
    marginBottom: 10,
  },
  highlightMeta: {
    display: 'flex',
    gap: 14,
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 12,
  },
};
