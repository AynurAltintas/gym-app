import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Enrollment } from '../enrollments/enrollment.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  ELITE_USER = 'elite_user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    default: UserRole.USER,
  })
  role: UserRole;
  

  // 👇 MUTLAKA class İÇİNDE
  @OneToMany(() => Enrollment, enrollment => enrollment.user)
  enrollments: Enrollment[];
}
