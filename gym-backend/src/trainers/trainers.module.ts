import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trainer } from './trainer.entity';
import { TrainersService } from './trainers.service';
import { TrainersController } from './trainers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Trainer])],
  providers: [TrainersService],
  controllers: [TrainersController],
  exports: [TypeOrmModule],
})
export class TrainersModule {}
