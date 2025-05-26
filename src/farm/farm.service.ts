import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Farm } from './farm.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm)
    private farmRepository: Repository<Farm>,
  ) {}

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    const farm = this.farmRepository.create(createFarmDto);
    return this.farmRepository.save(farm);
  }

  async findAll(): Promise<Farm[]> {
    return this.farmRepository.find({
      relations: ['producer', 'city'], // Carrega os relacionamentos com producer e city
    });
  }

  async findOne(id: number): Promise<Farm> {
    const farm = await this.farmRepository.findOne({
      where: { id },
      relations: ['producer', 'city'], // Carrega os relacionamentos com producer e city
    });

    if (!farm) {
      throw new NotFoundException(`Farm with ID "${id}" not found`);
    }
    return farm;
  }

  async update(id: number, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    const farm = await this.findOne(id);
    this.farmRepository.merge(farm, updateFarmDto);
    return this.farmRepository.save(farm);
  }

  async remove(id: number): Promise<void> {
    const farm = await this.findOne(id);
    await this.farmRepository.remove(farm);
  }
}
