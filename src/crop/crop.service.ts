import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from './crop.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

@Injectable()
export class CropService {
  constructor(
    @InjectRepository(Crop)
    private cropRepository: Repository<Crop>,
  ) {}

  async create(createCropDto: CreateCropDto): Promise<Crop> {
    const producer = this.cropRepository.create(createCropDto);
    return this.cropRepository.save(producer);
  }

  async findAll(): Promise<Crop[]> {
    return this.cropRepository.find();
  }

  async findOne(id: number): Promise<Crop> {
    const season = await this.cropRepository.findOne({ where: { id } });
    if (!season) {
      throw new NotFoundException(`Crop with ID "${id}" not found`);
    }
    return season;
  }

  async update(id: number, updateCropDto: UpdateCropDto): Promise<Crop> {
    const season = await this.findOne(id);
    this.cropRepository.merge(season, updateCropDto);
    return this.cropRepository.save(season);
  }

  async remove(id: number): Promise<void> {
    const season = await this.findOne(id);
    await this.cropRepository.remove(season);
  }
}
