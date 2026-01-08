import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { Trainer } from '../trainers/trainer.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,

    @InjectRepository(Trainer)
    private trainerRepo: Repository<Trainer>,
  ) {}

  async create(
    title: string,
    description: string,
    capacity: number,
    trainerId: number,
  ) {
    const trainer = await this.trainerRepo.findOne({
      where: { id: trainerId },
    });

    if (!trainer) {
      throw new NotFoundException('Trainer bulunamadı');
    }

    const course = this.courseRepo.create({
      title,
      description,
      capacity,
      trainer,
    });

    return this.courseRepo.save(course);
  }

  async findAll() {
  const courses = await this.courseRepo.find({
    relations: ['trainer', 'schedules', 'enrollments'],
  });

  return courses.map((course) => ({
    ...course,
    remaining: course.capacity - course.enrollments.length,
  }));
  }

  async remove(id: number) {
    const course = await this.courseRepo.findOne({ where: { id } });
    
    if (!course) {
      throw new NotFoundException('Kurs bulunamadı');
    }

    await this.courseRepo.remove(course);
    return { message: 'Kurs silindi' };
  }
}

