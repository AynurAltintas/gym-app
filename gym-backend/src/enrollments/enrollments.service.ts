import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollRepo: Repository<Enrollment>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
  ) {}

  async enroll(userId: number, courseId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const course = await this.courseRepo.findOne({ where: { id: courseId } });

    if (!user || !course) throw new NotFoundException();

    // Rol bazlı erişim kontrolü
    if (user.role === 'user' && course.capacity === 1) {
      throw new BadRequestException('Bireysel kurslara sadece Elite üyeler kayıt olabilir');
    }

    const already = await this.enrollRepo.findOne({
      where: {
        user: { id: userId },
        course: { id: courseId },
      },
      relations: ['user', 'course'],
    });

    if (already) throw new BadRequestException('Zaten bu kursa kayıtlısınız');

    const count = await this.enrollRepo.count({ where: { course: { id: courseId } } });
    if (count >= course.capacity) throw new BadRequestException('Kurs dolu');

    const enrollment = this.enrollRepo.create({ user, course });
    return this.enrollRepo.save(enrollment);
  }
  async findMyEnrollments(userId: number) {
    return this.enrollRepo.find({
      where: {
        user: { id: userId },
      },
      relations: ['course', 'course.schedules', 'course.trainer'],
    });
  }

  async unenroll(userId: number, courseId: number) {
    const enrollment = await this.enrollRepo.findOne({
      where: { user: { id: userId }, course: { id: courseId } },
      relations: ['course', 'user'],
    });

    if (!enrollment) {
      throw new NotFoundException('Kayıt bulunamadı');
    }

    await this.enrollRepo.remove(enrollment);
    return { message: 'Kayıt silindi' };
  }

  async findByTrainerCourse(trainerId: number, courseId: number) {
    return this.enrollRepo.find({
      where: {
        course: { id: courseId, trainer: { id: trainerId } },
      },
      relations: ['user', 'course'],
    });
  }

  findAll() {
    return this.enrollRepo.find({
      relations: ['user', 'course'],
    });
  }
}
