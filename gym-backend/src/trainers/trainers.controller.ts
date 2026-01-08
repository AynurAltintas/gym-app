import { Controller, Post, Body, Get, Delete, Param, ParseIntPipe, UseGuards, Patch } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Post()
  createTrainer(
    @Body('name') name: string,
    @Body('expertise') expertise: string,
  ) {
    return this.trainersService.create(name, expertise);
  }

  @Get()
  getAllTrainers() {
    return this.trainersService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateTrainer(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name?: string,
    @Body('expertise') expertise?: string,
  ) {
    return this.trainersService.update(id, name, expertise);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeTrainer(@Param('id', ParseIntPipe) id: number) {
    return this.trainersService.remove(id);
  }
}
