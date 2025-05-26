import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Season } from './season.entity';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';

@Injectable()
export class SeasonService {
  constructor(
    @InjectRepository(Season)
    private seasonRepository: Repository<Season>,
  ) {}

  async create(createSeasonDto: CreateSeasonDto): Promise<Season> {
    const producer = this.seasonRepository.create(createSeasonDto);
    return this.seasonRepository.save(producer);
  }

  async findAll(): Promise<Season[]> {
    return this.seasonRepository.find();
  }

  async findOne(id: number): Promise<Season> {
    const season = await this.seasonRepository.findOne({ where: { id } });
    if (!season) {
      throw new NotFoundException(`Season with ID "${id}" not found`);
    }
    return season;
  }

  async update(id: number, updateSeasonDto: UpdateSeasonDto): Promise<Season> {
    const season = await this.findOne(id);
    this.seasonRepository.merge(season, updateSeasonDto);
    return this.seasonRepository.save(season);
  }

  async remove(id: number): Promise<void> {
    const season = await this.findOne(id);
    await this.seasonRepository.remove(season);
  }
}
