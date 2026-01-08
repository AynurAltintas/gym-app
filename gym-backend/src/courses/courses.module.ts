import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Trainer } from '../trainers/trainer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Trainer])],
  providers: [CoursesService],
  controllers: [CoursesController],
})
export class CoursesModule {}
