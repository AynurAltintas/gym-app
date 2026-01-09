import { Controller, Get, Post, Body, UseGuards, Request, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createCourse(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('capacity') capacity: number,
    @Body('trainerId') trainerId: number,
  ) {
    return this.coursesService.create(
      title,
      description,
      capacity,
      trainerId,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeCourse(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }
}

