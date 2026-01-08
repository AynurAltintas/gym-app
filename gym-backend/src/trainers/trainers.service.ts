import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainer } from './trainer.entity';

@Injectable()
export class TrainersService {
  constructor(
    @InjectRepository(Trainer)
    private trainerRepo: Repository<Trainer>,
  ) {}

  create(name: string, expertise: string) {
    const trainer = this.trainerRepo.create({
      name,
      expertise,
    });
    return this.trainerRepo.save(trainer);
  }

  findAll() {
    return this.trainerRepo.find();
  }

  findOne(id: number) {
    return this.trainerRepo.findOne({ where: { id } });
  }

  async update(id: number, name?: string, expertise?: string) {
    const trainer = await this.trainerRepo.findOne({ where: { id } });
    
    if (!trainer) {
      throw new NotFoundException('Eğitmen bulunamadı');
    }

    if (name !== undefined) trainer.name = name;
    if (expertise !== undefined) trainer.expertise = expertise;

    return this.trainerRepo.save(trainer);
  }

  async remove(id: number) {
    const trainer = await this.trainerRepo.findOne({ where: { id } });
    
    if (!trainer) {
      throw new NotFoundException('Eğitmen bulunamadı');
    }

    await this.trainerRepo.remove(trainer);
    return { message: 'Eğitmen silindi' };
  }
}
