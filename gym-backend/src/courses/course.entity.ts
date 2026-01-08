import { Entity, PrimaryGeneratedColumn, Column,ManyToOne, OneToMany } from 'typeorm';
import { Trainer } from '../trainers/trainer.entity';
import { Schedule } from '../schedules/schedule.entity';
import { Enrollment } from '../enrollments/enrollment.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  capacity: number;

  // Her kursun bir eğitmeni olur
  @ManyToOne(() => Trainer, (trainer) => trainer.courses, { eager: true })
  trainer: Trainer;

  // Kursun birden fazla zamanı olabilir
  @OneToMany(() => Schedule, (schedule) => schedule.course)
  schedules: Schedule[];

  // Kursa kayıt olan kullanıcılar
  @OneToMany(() => Enrollment, enrollment => enrollment.course)
  enrollments: Enrollment[];
}
