import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planting } from './planting.entity';
import { CreatePlantingDto } from './dto/create-planting.dto';
import { UpdatePlantingDto } from './dto/update-planting.dto';

@Injectable()
export class PlantingService {
  constructor(
    @InjectRepository(Planting)
    private plantingRepository: Repository<Planting>,
  ) {}

  async create(createPlantingDto: CreatePlantingDto): Promise<Planting> {
    const planting = this.plantingRepository.create({
      farm: { id: createPlantingDto.farmId },
      season: { id: createPlantingDto.seasonId },
      crop: { id: createPlantingDto.cropId },
    });

    return this.plantingRepository.save(planting);
  }

  async findAll(): Promise<Planting[]> {
    return this.plantingRepository.find({
      relations: ['farm', 'season', 'crop'], // Carrega o relacionamento com farm, season e crop
    });
  }

  async findOne(id: number): Promise<Planting> {
    const planting = await this.plantingRepository.findOne({
      where: { id },
      relations: ['farm', 'season', 'crop'], // Carrega o relacionamento com farm, season e crop
    });
    if (!planting) {
      throw new NotFoundException(`Planting with ID "${id}" not found`);
    }
    return planting;
  }

  async update(
    id: number,
    updatePlantingDto: UpdatePlantingDto,
  ): Promise<Planting> {
    const planting = await this.findOne(id);
    const updateObject: Partial<Planting> = {};

    if (updatePlantingDto.cropId !== undefined) {
      updateObject.crop = { id: updatePlantingDto.cropId } as any;
    }

    this.plantingRepository.merge(planting, updateObject);

    return this.plantingRepository.save(planting);
  }

  async remove(id: number): Promise<void> {
    const planting = await this.findOne(id);
    await this.plantingRepository.remove(planting);
  }
}
