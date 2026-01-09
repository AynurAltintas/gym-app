import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createSchedule(
    @Body('day') day: string,
    @Body('startTime') startTime: string,
    @Body('duration') duration: number,
    @Body('courseId') courseId: number,
  ) {
    return this.schedulesService.create(
      day,
      startTime,
      duration,
      courseId,
    );
  }

  @Get()
  findAll() {
    return this.schedulesService.findAll();
  }
}
