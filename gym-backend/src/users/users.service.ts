import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepo.find({
      select: ['id', 'email', 'name', 'role'], // 🔴 password YOK
    });
  }

  async create(email: string, password: string, name?: string, role?: 'user' | 'elite_user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let userRole = UserRole.USER;
    if (role === 'elite_user') {
      userRole = UserRole.ELITE_USER;
    } else if (role === 'user') {
      userRole = UserRole.USER;
    }
    
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      name,
      role: userRole,
    });
    return this.userRepo.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
    });
  }

  async findById(id: number) {
    return this.userRepo.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'role'],
    });
  }
}
