import { Entity, PrimaryGeneratedColumn, ManyToOne ,CreateDateColumn} from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.enrollments,{ eager: true })
  user: User;

  @ManyToOne(() => Course, course => course.enrollments,{ eager: true })
  course: Course;

  @CreateDateColumn()
  enrolledAt: Date;
}
