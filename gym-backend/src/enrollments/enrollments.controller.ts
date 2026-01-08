import { Controller, Post, Get, Body, UseGuards, Request, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  // Kullanıcı kendini kursa kaydeder
  @Post()
  enroll(@Request() req, @Body('courseId') courseId: number) {
    return this.enrollmentsService.enroll(req.user.userId, courseId);
  }

  @Get('my')
  getMyEnrollments(@Request() req) {
    return this.enrollmentsService.findMyEnrollments(req.user.userId);
  }

  @Delete(':courseId')
  unenroll(
    @Request() req,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.enrollmentsService.unenroll(req.user.userId, courseId);
  }

  // Admin tüm kayıtları görür
  @Get()
  @Roles('admin')
  findAll() {
    return this.enrollmentsService.findAll();
  }
}
