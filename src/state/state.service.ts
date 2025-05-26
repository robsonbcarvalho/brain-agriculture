import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from './state.entity';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(State)
    private stateRepository: Repository<State>,
  ) {}

  async create(createStateDto: CreateStateDto): Promise<State> {
    const producer = this.stateRepository.create(createStateDto);
    return this.stateRepository.save(producer);
  }

  async findAll(): Promise<State[]> {
    return this.stateRepository.find();
  }

  async findOne(id: number): Promise<State> {
    const state = await this.stateRepository.findOne({ where: { id } });
    if (!state) {
      throw new NotFoundException(`State with ID "${id}" not found`);
    }
    return state;
  }

  async update(id: number, updateStateDto: UpdateStateDto): Promise<State> {
    const state = await this.findOne(id);
    this.stateRepository.merge(state, updateStateDto);
    return this.stateRepository.save(state);
  }

  async remove(id: number): Promise<void> {
    const state = await this.findOne(id);
    await this.stateRepository.remove(state);
  }
}
