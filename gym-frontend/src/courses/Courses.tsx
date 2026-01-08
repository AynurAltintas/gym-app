import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Trainer {
  id: number;
  name: string;
  expertise: string;
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
  trainer: Trainer;
  schedules: Schedule[];
  remaining: number; 
}

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Array<Course & { remaining: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false });
  const [enrolling, setEnrolling] = useState<number[]>([]);
  const [userRole, setUserRole] = useState<'USER' | 'ADMIN' | 'ELITE_USER' | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          try {
            const profile = await api.get('/users/profile', {
              headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Backend role:', profile.data.role);
            const upperRole = profile.data.role.toUpperCase();
            console.log('Upper role:', upperRole);
            setUserRole(upperRole);
          } catch (e) {
          }
        }

        const res = await api.get<Course[]>('/courses', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        setCourses(res.data);
      } catch (err) {
        setError('Kurslar yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const showToast = (msg: string) => {
    setToast({ msg, show: true });
    window.setTimeout(() => setToast({ msg: '', show: false }), 2600);
  };

  const handleEnroll = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Kayıt için lütfen giriş yapın');
      navigate('/login');
      return;
    }

    if (enrolling.includes(id)) return; 

    try {
      setEnrolling((s) => [...s, id]);
      await api.post(
        '/enrollments',
        { courseId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, remaining: Math.max(0, c.remaining - 1) } : c)),
      );

      showToast('Kursa başarıyla kaydoldunuz!');
    } catch (e: any) {
      if (e?.response?.status === 401) {
        showToast('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
        navigate('/login');
      } else if (e?.response?.data?.message) {
        showToast(String(e.response.data.message));
      } else {
        showToast('Kayıt sırasında hata oluştu.');
      }
    } finally {
      setEnrolling((s) => s.filter((x) => x !== id));
    }
  };

  const cardTheme = {
    hero: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.22), transparent 40%), radial-gradient(circle at 80% 10%, rgba(34,197,94,0.22), transparent 36%), #0f1214',
    border: 'linear-gradient(135deg, rgba(59,130,246,0.6), rgba(34,197,94,0.5))',
  };

  if (loading) return <p className="empty-state">Yükleniyor...</p>;
  if (error) return <p className="empty-state" style={{ color: 'var(--accent)' }}>{error}</p>;

  const privateCourses = courses.filter(c => c.capacity === 1);
  const groupCourses = courses.filter(c => c.capacity > 1);

  const renderCourseCard = (course: Course) => {
    const percent = Math.round(((course.capacity - course.remaining) / course.capacity) * 100);
    const isEnrolling = enrolling.includes(course.id);
    
    const isPrivateCourse = course.capacity === 1;
    const canEnroll = userRole === 'ADMIN' || 
                    userRole === 'ELITE_USER' ||
                    (userRole === 'USER' && !isPrivateCourse);
    const accessDenied = (userRole && !canEnroll) ?? false;
    const denialMessage = userRole === 'USER' && isPrivateCourse 
      ? 'Bireysel kurslara sadece Elite üyeler kayıt olabilir'
      : '';

    return (
      <article
        key={course.id}
        className="course-card neon"
        aria-live="polite"
        style={{ ['--neonGrad' as any]: cardTheme.border }}
      >
        <div className="neon-hero" style={{ background: cardTheme.hero }}>
        </div>
        <div className="course-body">
          <h3 className="course-title">{course.title}</h3>
          <div className="course-badges">
            <div
              className="course-tag"
              data-variant={isPrivateCourse ? 'private' : 'group'}
            >
              <span>{isPrivateCourse ? '⭐ Bireysel Ders' : '👥 Grup Dersi'}</span>
              <span className="tag-chip">
                {isPrivateCourse ? 'Elite avantajı' : 'Herkese açık'}
              </span>
            </div>
            <span
              className="pill-status"
              data-state={course.remaining <= 0 ? 'full' : 'open'}
            >
              {course.remaining <= 0 ? 'Dolu' : `${course.remaining} yer`}
            </span>
          </div>
          <p className="course-desc">{course.description}</p>
          <p className="trainer">
            👩‍🏫 {course.trainer.name} ({course.trainer.expertise})
          </p>

          <div className="schedule">
            {course.schedules.length === 0 ? (
              <span className="muted">Program yok</span>
            ) : (
              course.schedules.map((s) => (
                <div key={s.id} className="schedule-item">
                  📅 {s.day} – {s.startTime} ({s.duration} dk)
                </div>
              ))
            )}
          </div>

          <div className="course-meta">
            <div>
              <div className="badge">Kapasite: {course.capacity}</div>
              <div className="capacity" aria-hidden>
                <div className="capacity-fill" style={{ width: `${percent}%` }} />
              </div>
              <div style={{ marginTop: 6, color: 'var(--muted)', fontSize: 12 }}>
                {course.remaining > 0 ? `${course.remaining} yer kaldı` : <span style={{ color: '#ff8b8b' }}>DOLU</span>}
              </div>
            </div>

            <div>
              {accessDenied && (
                <div style={{ color: '#ff8b8b', fontSize: 12, marginBottom: 6 }}>
                  {denialMessage}
                </div>
              )}
              <button
                className="enroll-button"
                onClick={() => handleEnroll(course.id)}
                disabled={course.remaining <= 0 || isEnrolling || accessDenied}
                aria-disabled={course.remaining <= 0 || isEnrolling || accessDenied}
                aria-label={`Kursa kayıt ol ${course.title}`}
              >
                {isEnrolling ? 'İşleniyor...' : course.remaining <= 0 ? 'Dolu' : accessDenied ? 'Erişim Yok' : 'Kaydol'}
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="courses">
      <h2>Kurslar</h2>

      {courses.length === 0 ? (
        <div className="empty-state">Henüz kurs yok.</div>
      ) : (
        <>
          {/* Bireysel Dersler */}
          {privateCourses.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <h3 style={{ 
                color: '#a855f7', 
                marginBottom: 16, 
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <span>⭐</span> Bireysel Dersler
                <span style={{ 
                  fontSize: 12, 
                  color: '#9CA3AF',
                  fontWeight: 400,
                  marginLeft: 8
                }}>
                  (Sadece Elite Üyeler)
                </span>
              </h3>
              <div className="course-grid">
                {privateCourses.map(renderCourseCard)}
              </div>
            </div>
          )}

          {/* Grup Dersleri */}
          {groupCourses.length > 0 && (
            <div>
              <h3 style={{ 
                color: '#22c55e', 
                marginBottom: 16, 
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <span>👥</span> Grup Dersleri
              </h3>
              <div className="course-grid">
                {groupCourses.map(renderCourseCard)}
              </div>
            </div>
          )}
        </>
      )}

      <div className={`toast ${toast.show ? 'show' : ''}`} role="status" aria-live="polite">
        {toast.msg}
      </div>
      <style>{embeddedCourseCss}</style>
    </div>
  );
};
const embeddedCourseCss = `
:root {
  --card-padding: 1rem;
  --accent: #22c55e;
  --accent-light: #84cc16;
  --card-bg: #1a1a1a;
  --muted: #94a3b8;
}

.courses {
  padding: 2rem 3rem;
  width: calc(100% - 96px);
  max-width: 1400px;
  margin: 0 auto;
}

.courses h2 {
  color: #fff;
  margin-bottom: 1.5rem;
  text-align: left;
  font-family: "Inter", sans-serif;
  position: relative;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  grid-auto-rows: 1fr;
}

.course-card {
  position: relative;
  background: linear-gradient(
    160deg,
    rgba(17, 24, 39, 0.9),
    rgba(12, 18, 24, 0.9)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0;
  border-radius: 16px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
  transition: transform 0.25s ease, box-shadow 0.25s ease,
    border-color 0.25s ease, background 0.25s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.course-card:hover {
  transform: translateY(-4px);
  border-color: rgba(34, 197, 94, 0.28);
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.45);
}

.course-card.neon::before {
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

.course-card.neon:hover::before {
  opacity: 0.7;
}

.neon-hero {
  height: 140px;
  width: 100%;
  background: radial-gradient(
      circle at 20% 20%,
      rgba(34, 197, 94, 0.18),
      transparent 40%
    ),
    radial-gradient(
      circle at 80% 10%,
      rgba(59, 130, 246, 0.18),
      transparent 36%
    ),
    #0f1214;
  position: relative;
}

.corner-badge {
  position: absolute;
  top: 10px;
  left: 12px;
  font-size: 28px;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.45));
}

.course-body {
  padding: var(--card-padding);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.course-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  position: relative;
}

.course-title::after {
  content: "";
  display: block;
  width: 64px;
  height: 2px;
  border-radius: 999px;
  margin-top: 8px;
  background: linear-gradient(90deg, var(--accent), var(--accent-light));
}

.course-desc {
  color: #cbd5e1;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  min-height: 42px;
}

.course-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.course-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  width: fit-content;
}

.course-tag[data-variant="private"] {
  color: #c084fc;
  border-color: rgba(192, 132, 252, 0.35);
  background: rgba(192, 132, 252, 0.08);
}

.course-tag[data-variant="group"] {
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.35);
  background: rgba(74, 222, 128, 0.08);
}

.course-tag .tag-chip {
  padding: 4px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  font-weight: 600;
  font-size: 11px;
}

.pill-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
}

.pill-status[data-state="open"] {
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.35);
  background: rgba(74, 222, 128, 0.08);
}

.pill-status[data-state="full"] {
  color: #f97316;
  border-color: rgba(249, 115, 22, 0.35);
  background: rgba(249, 115, 22, 0.08);
}

.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  color: var(--muted);
  font-size: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 1rem;
}

.trainer {
  font-size: 13px;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 4px;
}

.badge {
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.capacity {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
  margin-top: 0.8rem;
}

.capacity-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-light));
  transition: width 0.8s cubic-bezier(0.2, 0.9, 0.2, 1);
}

.enroll-button {
  background: transparent;
  border: 1px solid var(--accent);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  color: var(--accent);
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.enroll-button:hover:not([disabled]) {
  background: var(--accent);
  color: #050505;
  box-shadow: 0 8px 18px rgba(34, 197, 94, 0.28);
}

.enroll-button[disabled] {
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.2);
  cursor: not-allowed;
}

.toast {
  position: fixed;
  right: 20px;
  bottom: 24px;
  background: #1e293b;
  border-left: 4px solid var(--accent);
  color: white;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  transform: translateY(15px);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.toast.show {
  transform: translateY(0);
  opacity: 1;
}
.toast.success {
  border-left-color: #22c55e;
}
`;

export default Courses;
