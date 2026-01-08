import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './schedule.entity';
import { Course } from '../courses/course.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepo: Repository<Schedule>,

    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
  ) {}

  async create(
    day: string,
    startTime: string,
    duration: number,
    courseId: number,
  ) {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const schedule = this.scheduleRepo.create({
      day,
      startTime,
      duration,
      course,
    });

    return this.scheduleRepo.save(schedule);
  }

  findAll() {
    return this.scheduleRepo.find({
      relations: ['course'],
    });
  }
}
