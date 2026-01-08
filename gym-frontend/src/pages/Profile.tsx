import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface User {
  id: number;
  name?: string;
  email: string;
  role: 'admin' | 'user';
}

interface Schedule {
  id: number;
  day: string;
  startTime: string;
  duration: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  capacity: number;
  schedules?: Schedule[];
}

interface EnrollmentItem {
  enrollmentId: number;
  course: Course;
}

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<EnrollmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  const load = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await Promise.all([
        fetchProfile(),
        fetchMyCourses(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  load();
}, []);

  const fetchProfile = async () => {
  try {
    const res = await api.get('/users/profile');
    setUser(res.data);
  } catch {
    setError('Profil bilgileri alınamadı');
  }
};

  const fetchMyCourses = async () => {
  try {
    const res = await api.get('/enrollments/my');
    setCourses(res.data.map((e: any) => ({ enrollmentId: e.id, course: e.course })));
  } catch {
    setError('Kurslar yüklenemedi');
  }
};

  const handleLeaveCourse = async (courseId: number) => {
    try {
      await api.delete(`/enrollments/${courseId}`);
      setCourses((prev) => prev.filter((c) => c.course.id !== courseId));
    } catch {
      setError('Kayıttan çıkılamadı');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const courseCount = courses.length;
  const scheduleItems = computeSchedule(courses);

  if (loading) {
    return <div style={styles.loading}>Yükleniyor...</div>;
  }

  const cardTheme = {
    hero: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.22), transparent 40%), radial-gradient(circle at 80% 10%, rgba(34,197,94,0.22), transparent 36%), #0f1214',
    border: 'linear-gradient(135deg, rgba(59,130,246,0.6), rgba(34,197,94,0.5))',
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Profil Kartı */}
        <article 
          className="profile-card neon"
          style={{ 
            ...styles.card, 
            ['--neonGrad' as any]: cardTheme.border 
          }}
        >
          <div style={{ ...styles.cardHero, background: cardTheme.hero }} />
          <div style={styles.cardContent}>
            {error && <div style={styles.error}>{error}</div>}

            {user && (
              <>
                <div style={styles.header}>
                  <div style={styles.avatar} aria-hidden>
                    {(user?.name || user?.email || 'R').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={styles.label}>Profil</p>
                    <h2 style={styles.name}>{user?.name || user?.email?.split('@')[0]}</h2>
                    <div style={styles.chipsRow}>
                      <span style={styles.chipMuted}>{user.email}</span>
                      <span style={styles.roleBadge}>{user.role.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div style={styles.infoSection}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>İsim</span>
                    <span style={styles.infoValue}>{user.name || user.email.split('@')[0]}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Rol</span>
                    <span style={styles.infoValue}>{user.role.toUpperCase()}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Aktif Dersler</span>
                    <span style={styles.infoValue}>{courseCount}</span>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <div style={styles.adminBadge}>⚙️ Admin Panel Erişimi</div>
                )}

                <button onClick={logout} style={styles.logout}>
                  Çıkış Yap
                </button>
              </>
            )}
          </div>
        </article>

        {/* Kayıtlı Kurslar */}
        <section style={styles.coursesSection}>
          <h3 style={styles.sectionTitle}>
            Kayıtlı Dersler
            <span style={styles.countBadge}>{courses.length}</span>
          </h3>

          {courses.length === 0 && (
            <p style={styles.emptyState}>Henüz bir derse kayıtlı değilsin.</p>
          )}

          <div style={styles.courseGrid}>
            {courses.map(({ course }) => (
              <article 
                key={course.id} 
                className="course-card neon profile-course"
                style={{ ['--neonGrad' as any]: cardTheme.border }}
              >
                <div style={{ ...styles.neonHero, background: cardTheme.hero }} />
                <div style={styles.courseBody}>
                  <h4 style={styles.courseTitle}>{course.title}</h4>
                  
                  <div style={styles.courseInfo}>
                    <div style={styles.infoRow2}>
                      <span style={styles.infoLabel2}>Eğitmen</span>
                      <span style={styles.infoValue2}>{course.schedules?.length || 0} program</span>
                    </div>
                    <div style={styles.infoRow2}>
                      <span style={styles.infoLabel2}>Kapasite</span>
                      <span style={styles.infoValue2}>{course.capacity} kişi</span>
                    </div>
                  </div>

                  <div style={styles.scheduleList2}>
                    {course.schedules && course.schedules.length > 0 ? (
                      course.schedules.map((s) => (
                        <div key={s.id} style={styles.scheduleChip}>
                          📅 {s.day} – {s.startTime}
                        </div>
                      ))
                    ) : (
                      <span style={styles.muted}>Program yok</span>
                    )}
                  </div>

                  <button
                    style={styles.leaveButton}
                    onClick={() => handleLeaveCourse(course.id)}
                  >
                    Kayıttan Çık
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Haftalık Program */}
        <section style={styles.scheduleSection}>
          <h3 style={styles.sectionTitle}>
            Haftalık Program
          </h3>
          {scheduleItems.length === 0 ? (
            <p style={styles.emptyState}>Programın boş görünüyor.</p>
          ) : (
            <div style={styles.scheduleList}>
              {scheduleItems.map((item) => (
                <div key={`${item.id}-${item.course}`} style={styles.scheduleRow}>
                  <div style={styles.scheduleDay}>{item.day}</div>
                  <div style={styles.scheduleInfo}>
                    <div style={styles.scheduleCourse}>{item.course}</div>
                    <div style={styles.scheduleTime}>{item.startTime} · {item.duration} dk</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <style>{`
/* Profile Page Styles */

.profile-card {
  position: relative;
  background: linear-gradient(
    160deg,
    rgba(17, 24, 39, 0.9),
    rgba(12, 18, 24, 0.9)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
  transition: transform 0.25s ease, box-shadow 0.25s ease,
    border-color 0.25s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.profile-card:hover {
  transform: translateY(-4px);
  border-color: rgba(34, 197, 94, 0.28);
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.45);
}

.profile-card.neon::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 18px;
  padding: 2px;
  background: var(
    --neonGrad,
    linear-gradient(135deg, rgba(34, 197, 94, 0.35), rgba(59, 130, 246, 0.3))
  );
  -webkit-mask: linear-gradient(#000, #000) content-box,
    linear-gradient(#000, #000);
  mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.4;
}

.profile-card.neon:hover::before {
  opacity: 0.7;
}

/* Course Cards in Profile */
.profile-course {
  position: relative;
  background: linear-gradient(
    160deg,
    rgba(17, 24, 39, 0.9),
    rgba(12, 18, 24, 0.9)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
  transition: transform 0.25s ease, box-shadow 0.25s ease,
    border-color 0.25s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.profile-course:hover {
  transform: translateY(-4px);
  border-color: rgba(34, 197, 94, 0.28);
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.45);
}

.profile-course.neon::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 18px;
  padding: 2px;
  background: var(
    --neonGrad,
    linear-gradient(135deg, rgba(34, 197, 94, 0.35), rgba(59, 130, 246, 0.3))
  );
  -webkit-mask: linear-gradient(#000, #000) content-box,
    linear-gradient(#000, #000);
  mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.4;
}

.profile-course.neon:hover::before {
  opacity: 0.7;
}
      `}</style>
    </div>
  );
};

export default Profile;

// Kullanıcının kayıtlı kurslarındaki programı tek listede gösterir
const dayOrder = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

const computeSchedule = (courses: EnrollmentItem[]) => {
  const items = courses.flatMap(({ course }) =>
    (course.schedules || []).map((s) => ({
      id: s.id,
      day: s.day,
      startTime: s.startTime,
      duration: s.duration,
      course: course.title,
    })),
  );

  const parseTime = (t: string) => {
    const [h, m] = t.split(':').map((n) => Number(n) || 0);
    return h * 60 + m;
  };

  return items.sort((a, b) => {
    const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return parseTime(a.startTime) - parseTime(b.startTime);
  });
};
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    padding: '1.5rem 2rem',
    background: 'linear-gradient(135deg, #050505, #0A110D)',
    color: '#e5e7eb',
    fontFamily: "'Inter', sans-serif",
  },
  container: {
    maxWidth: 1000,
    margin: '0 auto',
  },
  card: {
    padding: 0,
    borderRadius: 16,
    background: 'linear-gradient(160deg, rgba(17, 24, 39, 0.9), rgba(12, 18, 24, 0.9))',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 10px 26px rgba(0,0,0,0.35)',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 32,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 480,
    margin: '0 auto 32px',
  },
  cardHero: {
    height: 120,
    width: '100%',
    position: 'relative',
  },
  cardContent: {
    padding: 20,
    position: 'relative',
    zIndex: 1,
  },
  cardAccent: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(120deg, rgba(34,197,94,0.08), transparent 45%), linear-gradient(300deg, rgba(59,130,246,0.1), transparent 40%)',
    pointerEvents: 'none',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    position: 'relative',
    zIndex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 14,
    display: 'grid',
    placeItems: 'center',
    fontWeight: 900,
    letterSpacing: '0.06em',
    color: '#041107',
    background: 'linear-gradient(135deg, #22c55e, #4ade80)',
    boxShadow: '0 12px 28px rgba(34,197,94,0.25)',
    flexShrink: 0,
  },
  label: {
    margin: 0,
    color: '#9CA3AF',
    letterSpacing: '0.08em',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  name: {
    margin: '2px 0 6px',
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: 800,
  },
  chipsRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  chipMuted: {
    padding: '4px 8px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.05)',
    color: '#cbd5e1',
    fontSize: 12,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  chipCount: {
    padding: '4px 10px',
    borderRadius: 999,
    background: 'rgba(59,130,246,0.12)',
    color: '#93c5fd',
    fontSize: 12,
    border: '1px solid rgba(59,130,246,0.32)',
    fontWeight: 700,
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    marginBottom: 20,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  infoRow2: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 0',
    fontSize: 13,
  },
  infoLabel: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  infoLabel2: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  infoValue: {
    color: '#f8fafc',
    fontWeight: 600,
    fontSize: 13,
  },
  infoValue2: {
    color: '#f8fafc',
    fontWeight: 600,
    fontSize: 13,
  },
  roleBadge: {
    padding: '4px 10px',
    borderRadius: 999,
    background: 'rgba(34,197,94,0.12)',
    color: '#22c55e',
    border: '1px solid rgba(34,197,94,0.35)',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  adminBadge: {
    marginBottom: 16,
    padding: '6px 12px',
    display: 'inline-block',
    background: 'linear-gradient(90deg, #22C55E, #84CC16)',
    color: '#050505',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  logout: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    border: 'none',
    background: '#ef4444',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  coursesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    fontSize: 18,
    fontWeight: 700,
  },
  countBadge: {
    padding: '2px 8px',
    borderRadius: 999,
    background: 'rgba(34,197,94,0.12)',
    color: '#22c55e',
    border: '1px solid rgba(34,197,94,0.32)',
    fontSize: 12,
    fontWeight: 700,
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 24,
    gridAutoRows: '1fr',
  },
  neonHero: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  courseBody: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    flex: 1,
  },
  courseTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 700,
    margin: 0,
    marginBottom: 8,
  },
  courseInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    paddingBottom: 10,
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  scheduleList2: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 12,
  },
  scheduleChip: {
    padding: '6px 10px',
    borderRadius: 8,
    background: 'rgba(59,130,246,0.12)',
    color: '#93c5fd',
    fontSize: 12,
    border: '1px solid rgba(59,130,246,0.25)',
    display: 'inline-block',
    width: 'fit-content',
  },
  muted: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  leaveButton: {
    padding: 10,
    borderRadius: 10,
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: 13,
    transition: 'all 0.2s ease',
  },
  loading: {
    color: '#22C55E',
    textAlign: 'center',
    marginTop: 100,
    fontSize: '18px',
    fontWeight: 500,
  },
  error: {
    background: 'rgba(255,80,80,0.1)',
    color: '#ffb4b4',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
    border: '1px solid rgba(255,80,80,0.2)',
  },
  scheduleSection: {
    padding: 24,
    borderRadius: 16,
    background: 'linear-gradient(160deg, rgba(17, 24, 39, 0.9), rgba(12, 18, 24, 0.9))',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 10px 26px rgba(0,0,0,0.35)',
  },
  scheduleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginTop: 12,
  },
  scheduleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  scheduleDay: {
    minWidth: 110,
    padding: '6px 10px',
    borderRadius: 10,
    background: 'rgba(34,197,94,0.12)',
    color: '#22c55e',
    border: '1px solid rgba(34,197,94,0.32)',
    fontWeight: 700,
    textAlign: 'center',
    textTransform: 'capitalize',
    fontSize: 13,
  },
  scheduleInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  scheduleCourse: {
    color: '#f8fafc',
    fontWeight: 700,
    fontSize: 14,
  },
  scheduleTime: {
    color: '#cbd5e1',
    fontSize: 13,
  },
  emptyState: {
    color: '#94a3b8',
    fontSize: 14,
    margin: 0,
  },
};