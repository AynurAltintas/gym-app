import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Trainer {
  id: number;
  name: string;
  expertise: string;
}

interface ScheduleItem {
  id?: number;
  day: string;
  startTime: string;
  duration: number;
}

interface Enrollment {
  id: number;
  user: {
    id: number;
    email: string;
  };
}

interface AdminUser {
  id: number;
  email: string;
  name?: string;
  role: 'user' | 'admin' | 'elite_user';
}

interface Course {
  id: number;
  title: string;
  description: string;
  capacity: number;
  remaining: number;
  trainer: Trainer;
  enrollments: Enrollment[];
  schedules?: ScheduleItem[];
}

const Admin = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [trainerId, setTrainerId] = useState<number | ''>('');
  const [name, setName] = useState('');
  const [expertise, setExpertise] = useState('');
  const [scheduleDay, setScheduleDay] = useState('Pazartesi');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [scheduleDuration, setScheduleDuration] = useState(60);
  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>([]);
  // Düzenleme state'leri
  const [editTrainerId, setEditTrainerId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editExpertise, setEditExpertise] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchTrainers();
    fetchUsers();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get<Course[]>('/courses');
      setCourses(res.data);
    } catch {
      setError('Kurslar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    try {
      const res = await api.get<Trainer[]>('/trainers');
      setTrainers(res.data);
    } catch {
      setError('Eğitmenler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get<AdminUser[]>('/users');
      setUsers(res.data);
    } catch {
      setError('Kullanıcılar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !capacity || !trainerId) {
      alert('Lütfen zorunlu alanları doldurun');
      return;
    }

    if (scheduleList.length === 0) {
      alert('Lütfen haftalık programdan en az 1 zaman ekleyin');
      return;
    }

    try {
      const courseRes = await api.post('/courses', {
        title,
        description,
        capacity,
        trainerId,
      });

      const newCourseId = courseRes.data?.id;

      if (!newCourseId) {
        throw new Error('Kurs ID alınamadı');
      }

      // Kurs oluşturulduktan sonra programları ekle
      await Promise.all(
        scheduleList.map((sch) =>
          api.post('/schedules', {
            ...sch,
            courseId: newCourseId,
          }),
        ),
      );

      setTitle('');
      setDescription('');
      setCapacity(0);
      setTrainerId('');
      setScheduleList([]);

      setScheduleDay('Pazartesi');
      setScheduleTime('09:00');
      setScheduleDuration(60);

      fetchCourses();
    } catch (err) {
      console.error(err);
      alert('Kurs veya program eklenemedi');
    }
  };

  const handleAddScheduleItem = () => {
    if (!scheduleDay || !scheduleTime || !scheduleDuration) {
      alert('Lütfen gün, saat ve süre girin');
      return;
    }

    setScheduleList((prev) => [
      ...prev,
      {
        day: scheduleDay,
        startTime: scheduleTime,
        duration: Number(scheduleDuration),
      },
    ]);
  };

  const handleRemoveScheduleItem = (index: number) => {
    setScheduleList((prev) => prev.filter((_, i) => i !== index));
  };

  const startEditTrainer = (trainer: Trainer) => {
    setEditTrainerId(trainer.id);
    setEditName(trainer.name);
    setEditExpertise(trainer.expertise);
  };

  const cancelEditTrainer = () => {
    setEditTrainerId(null);
    setEditName('');
    setEditExpertise('');
  };

  const handleUpdateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTrainerId) return;
    if (!editName || !editExpertise) {
      alert('Lütfen ad ve uzmanlığı girin');
      return;
    }
    try {
      await api.patch(`/trainers/${editTrainerId}`, {
        name: editName,
        expertise: editExpertise,
      });
      cancelEditTrainer();
      fetchTrainers();
    } catch (err) {
      console.error(err);
      alert('Eğitmen güncellenemedi');
    }
  };
  const handleCreateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !expertise) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      await api.post('/trainers', {
        name,
        expertise,
      });

      setName('');
      setExpertise('');

      fetchTrainers();
    } catch {
      alert('Eğitmen eklenemedi');
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('Bu kursu silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await api.delete(`/courses/${courseId}`);
      fetchCourses();
    } catch {
      alert('Kurs silinemedi');
    }
  };

  const handleDeleteTrainer = async (trainerId: number) => {
    if (!confirm('Bu eğitmeni silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await api.delete(`/trainers/${trainerId}`);
      fetchTrainers();
    } catch {
      alert('Eğitmen silinemedi');
    }
  };

  const handleUpdateUserRole = async (userId: number, role: AdminUser['role']) => {
    try {
      await api.patch(`/users/${userId}/role`, { role });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    } catch (err) {
      console.error(err);
      alert('Rol güncellenemedi');
    }
  };

  if (loading) return <div style={styles.loading}>Yükleniyor...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.page}>
      <div style={styles.blobOne} aria-hidden />
      <div style={styles.blobTwo} aria-hidden />
      <div style={styles.container}>
        <section style={styles.hero}>
          <h1 style={styles.title}>Kontrol Paneli</h1>
        </section>

        <section style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionKicker}>Yönetim</p>
              <h3 style={styles.sectionTitle}>Kullanıcı Rolleri</h3>
            </div>
          </div>

          {users.length === 0 ? (
            <p style={styles.muted}>Henüz kullanıcı yüklenmedi</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {users.map((user) => (
                <div key={user.id} style={styles.userRow}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={styles.userEmail}>{user.email}</span>
                    <span style={styles.userName}>{user.name || 'İsim yok'}</span>
                  </div>
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateUserRole(user.id, e.target.value as AdminUser['role'])}
                    style={styles.roleSelect}
                  >
                    <option value="user">User</option>
                    <option value="elite_user">Elite User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Yeni Eğitmen Ekle</h3>
            </div>
          </div>
          <form onSubmit={handleCreateTrainer} style={styles.form}>
            <input
              placeholder="Eğitmen Adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />

            <input
              placeholder="Uzmanlık Alanı (Pilates, Yoga...)"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              style={styles.input}
            />

            <button style={styles.button}>Eğitmen Ekle</button>
          </form>
        </section>

        <section style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Kayıtlı Eğitmenler</h3>
            </div>
          </div>
          <div style={styles.trainerList}>
            {trainers.map((trainer) => (
              <div key={trainer.id} style={styles.trainerRow}>
                {editTrainerId === trainer.id ? (
                  <form onSubmit={handleUpdateTrainer} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
                    <div style={{ display: 'grid', gap: 8 }}>
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} style={styles.input} placeholder="Eğitmen Adı" />
                      <input value={editExpertise} onChange={(e) => setEditExpertise(e.target.value)} style={styles.input} placeholder="Uzmanlık" />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="submit" style={styles.button}>Kaydet</button>
                      <button type="button" style={styles.secondaryButton} onClick={cancelEditTrainer}>Vazgeç</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div>
                      <div style={styles.trainerName}>{trainer.name}</div>
                      <div style={styles.trainerExpertise}>{trainer.expertise}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => startEditTrainer(trainer)} style={styles.secondaryButton}>✏️ Düzenle</button>
                      <button onClick={() => handleDeleteTrainer(trainer.id)} style={styles.trainerDeleteButton}>🗑️ Sil</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
        
        <section style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Yeni Kurs Ekle</h3>
            </div>
          </div>
          <form onSubmit={handleCreateCourse} style={styles.form}>
            <input
              placeholder="Kurs Adı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />

            <textarea
              placeholder="Açıklama"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
            />

            <input
              type="number"
              placeholder="Kapasite"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              style={styles.input}
            />

            <select
              value={trainerId}
              onChange={(e) => setTrainerId(Number(e.target.value))}
              style={styles.input}
            >
              <option value="">Eğitmen Seç</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.expertise})
                </option>
              ))}
            </select>

            <div>
              <div style={styles.smallLabel}>Haftalık Program</div>
              <div style={styles.scheduleRow}>
                <select
                  value={scheduleDay}
                  onChange={(e) => setScheduleDay(e.target.value)}
                  style={styles.input}
                >
                  {['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'].map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="number"
                  min={15}
                  placeholder="Süre (dk)"
                  value={scheduleDuration}
                  onChange={(e) => setScheduleDuration(Number(e.target.value))}
                  style={styles.input}
                />
                <button type="button" style={styles.secondaryButton} onClick={handleAddScheduleItem}>
                  Program Ekle
                </button>
              </div>

              {scheduleList.length === 0 ? (
                <p style={styles.muted}>Henüz program eklenmedi</p>
              ) : (
                <div style={styles.scheduleChips}>
                  {scheduleList.map((sch, idx) => (
                    <div key={`${sch.day}-${sch.startTime}-${idx}`} style={styles.scheduleChip}>
                      <span>{sch.day} — {sch.startTime} ({sch.duration} dk)</span>
                      <button type="button" style={styles.chipRemove} onClick={() => handleRemoveScheduleItem(idx)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button style={styles.button}>Kurs Ekle</button>
          </form>
        </section>

        <section style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Tüm Kurslar</h3>
            </div>
          </div>
          <div style={styles.grid}>
            {courses.map((course) => (
              <div key={course.id} style={styles.card}>
                <h3 style={styles.courseCardTitle}>{course.title}</h3>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Eğitmen:</span>
                  <span style={styles.infoValue}>{course.trainer.name}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Kapasite:</span>
                  <span style={styles.infoValue}>{course.capacity}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Kayıtlı:</span>
                  <span style={styles.infoValue}>{course.enrollments.length}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Kalan:</span>
                  <span style={{
                    ...styles.infoValue,
                    color: course.remaining > 0 ? '#22c55e' : '#ef4444',
                    fontWeight: 700
                  }}>
                    {course.remaining > 0 ? course.remaining : 'DOLU'}
                  </span>
                </div>

                <div style={styles.enrollmentsBox}>
                  <strong style={styles.boxTitle}>Haftalık Program</strong>
                  {course.schedules && course.schedules.length > 0 ? (
                    <ul style={styles.enrollmentList}>
                      {course.schedules.map((sch, idx) => (
                        <li key={sch.id ?? idx} style={styles.listItem}>
                          {sch.day} — {sch.startTime} ({sch.duration} dk)
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={styles.muted}>Program eklenmemiş</p>
                  )}
                </div>
                
                <div style={styles.enrollmentsBox}>
                  <strong style={styles.boxTitle}>Kayıtlı Öğrenciler</strong>
                  {course.enrollments.length === 0 ? (
                    <p style={styles.muted}>Henüz kayıt yok</p>
                  ) : (
                    <ul style={styles.enrollmentList}>
                      {course.enrollments.map((enrollment) => (
                        <li key={enrollment.id} style={styles.listItem}>
                          {enrollment.user?.email ?? 'Bilinmiyor'}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <button 
                  onClick={() => handleDeleteCourse(course.id)}
                  style={styles.deleteButton}
                >
                  🗑️ Sil
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;


/* ================= STYLES ================= */

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    padding: 24,
    background:
      'radial-gradient(circle at 10% 20%, rgba(59,130,246,0.12), transparent 28%),\
       radial-gradient(circle at 80% 0%, rgba(34,197,94,0.12), transparent 26%),\
       linear-gradient(135deg, #050505, #0a0f0d 55%, #0f2417)',
    color: '#e5e7eb',
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    maxWidth: 1180,
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  blobOne: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(34,197,94,0.12), transparent 60%)',
    filter: 'blur(50px)',
    top: 60,
    left: -120,
  },
  blobTwo: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59,130,246,0.12), transparent 60%)',
    filter: 'blur(48px)',
    bottom: -100,
    right: -90,
  },
  hero: {
    padding: '18px 8px 32px',
    textAlign: 'left',
  },
  title: {
    fontSize: 36,
    lineHeight: 1.1,
    fontWeight: 900,
    color: '#f8fafc',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: 10,
    maxWidth: 640,
    lineHeight: 1.6,
  },
  sectionCard: {
    background: 'linear-gradient(160deg, rgba(11,17,21,0.9), rgba(10,18,24,0.85))',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
    backdropFilter: 'blur(6px)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionKicker: {
    color: '#22c55e',
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    margin: 0,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: 800,
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 20,
    marginTop: 12,
  },
  card: {
    background: 'linear-gradient(145deg, rgba(12,19,26,0.95), rgba(8,13,19,0.92))',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: 14,
    padding: 16,
    boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
  },
  courseCardTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: '#f8fafc',
    marginTop: 0,
    marginBottom: 14,
    letterSpacing: '-0.01em',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    fontSize: 14,
  },
  infoLabel: {
    color: '#94a3b8',
    fontWeight: 600,
    fontSize: 13,
  },
  infoValue: {
    color: '#e5e7eb',
    fontWeight: 600,
    fontSize: 14,
  },
  loading: {
    marginTop: 100,
    textAlign: 'center',
    color: '#22c55e',
  },
  error: {
    marginTop: 100,
    textAlign: 'center',
    color: '#ef4444',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 10,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #1e293b',
    background: '#020617',
    color: '#e5e7eb',
  },
  textarea: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #1e293b',
    background: '#020617',
    color: '#e5e7eb',
    minHeight: 80,
  },
  smallLabel: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: 600,
  },
  scheduleRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 1fr auto',
    gap: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: '#050505',
    cursor: 'pointer',
    fontWeight: 700,
    boxShadow: '0 12px 30px rgba(34,197,94,0.25)',
  },
  secondaryButton: {
    padding: 10,
    borderRadius: 10,
    border: '1px solid rgba(148,163,184,0.3)',
    background: 'rgba(255,255,255,0.02)',
    color: '#e5e7eb',
    cursor: 'pointer',
    fontWeight: 600,
  },
  deleteButton: {
    marginTop: 12,
    padding: 8,
    borderRadius: 8,
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    width: '100%',
  },
  enrollmentsBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
  },
  boxTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#f8fafc',
  },
  scheduleChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  scheduleChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 10px',
    borderRadius: 10,
    border: '1px solid #1e293b',
    background: '#0b1224',
    fontSize: 13,
  },
  chipRemove: {
    border: 'none',
    background: 'transparent',
    color: '#ef4444',
    cursor: 'pointer',
    fontWeight: 700,
  },
  enrollmentList: {
    listStyle: 'none',
    padding: 0,
    margin: '8px 0 0',
    display: 'grid',
    gap: 6,
  },
  listItem: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 1.5,
  },
  muted: {
    color: '#94a3b8',
    margin: '6px 0 0',
    fontSize: 14,
  },
  trainerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  trainerRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
  },
  trainerName: {
    fontWeight: 700,
    color: '#e5e7eb',
  },
  trainerExpertise: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },
  trainerDeleteButton: {
    padding: '8px 12px',
    borderRadius: 8,
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
    width: 'auto',
  },
  userRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    gap: 12,
  },
  userEmail: {
    color: '#e5e7eb',
    fontWeight: 700,
    fontSize: 14,
  },
  userName: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },
  roleSelect: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #1e293b',
    background: '#020617',
    color: '#e5e7eb',
    minWidth: 150,
    fontWeight: 600,
  },
};
