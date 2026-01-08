import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Courses.css';

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

        // Kullanıcı rolünü al
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
            // Profil alınamazsa role null kalır
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

    if (enrolling.includes(id)) return; // zaten istek yapılıyor

    try {
      setEnrolling((s) => [...s, id]);
      await api.post(
        '/enrollments',
        { courseId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Başarılıysa optimistic olarak kalan sayıyı azalt
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

  // Kursları bireysel ve grup olarak ayır
  const privateCourses = courses.filter(c => c.capacity === 1);
  const groupCourses = courses.filter(c => c.capacity > 1);

  const renderCourseCard = (course: Course) => {
    const percent = Math.round(((course.capacity - course.remaining) / course.capacity) * 100);
    const isEnrolling = enrolling.includes(course.id);
    
    // Rol bazlı erişim kontrolü
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
    </div>
  );
};

export default Courses;
