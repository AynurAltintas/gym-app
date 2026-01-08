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

  @ManyToOne(() => Trainer, (trainer) => trainer.courses, { eager: true })
  trainer: Trainer;

  @OneToMany(() => Schedule, (schedule) => schedule.course)
  schedules: Schedule[];

  @OneToMany(() => Enrollment, enrollment => enrollment.course)
  enrollments: Enrollment[];
}
