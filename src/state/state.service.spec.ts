import { Test, TestingModule } from '@nestjs/testing';
import { StateService } from './state.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { State } from './state.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';

describe('StateService', () => {
  let service: StateService;
  let repository: Repository<State>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StateService,
        {
          provide: getRepositoryToken(State),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            merge: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StateService>(StateService);
    repository = module.get<Repository<State>>(getRepositoryToken(State));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a state and return it', async () => {
      const createStateDto: CreateStateDto = { name: 'São Paulo', abbreviation: 'SP' };
      const expectedState: State = { id: 1, ...createStateDto, cities: [] };

      jest.spyOn(repository, 'create').mockReturnValue(expectedState);
      jest.spyOn(repository, 'save').mockResolvedValue(expectedState);

      const result = await service.create(createStateDto);

      expect(repository.create).toHaveBeenCalledWith(createStateDto);
      expect(repository.save).toHaveBeenCalledWith(expectedState);
      expect(result).toEqual(expectedState);
    });
  });

  describe('findAll', () => {
    it('should return all states', async () => {
      const expectedStates: State[] = [
        { id: 1, name: 'São Paulo', abbreviation: 'SP', cities: [] },
        { id: 2, name: 'Goiás', abbreviation: 'GO', cities: [] },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(expectedStates);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedStates);
    });
  });

  describe('findOne', () => {
    it('should return a state by id', async () => {
      const stateId = 1;
      const expectedState: State = {
        id: stateId,
        name: 'São Paulo',
        abbreviation: 'SP',
        cities: [],
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedState);

      const result = await service.findOne(stateId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: stateId },
      });
      expect(result).toEqual(expectedState);
    });

    it('should throw NotFoundException if state is not found', async () => {
      const stateId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(stateId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: stateId },
      });
    });
  });

  describe('update', () => {
    it('should update a state and return the updated state', async () => {
      const stateId = 1;
      const updateStateDto: UpdateStateDto = { name: 'Updated Test State' };
      const existingState: State = {
        id: stateId,
        name: 'São Paulo',
        abbreviation: 'SP',
        cities: [],
      };
      const mergedState: State = { ...existingState, ...updateStateDto }; // Estado mesclado

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingState);
      jest
        .spyOn(repository, 'merge')
        .mockImplementation((entity: any, updateEntity: any) => {
          Object.assign(entity, updateEntity);
          return entity;
        });
      jest.spyOn(repository, 'save').mockResolvedValue(mergedState);

      const result = await service.update(stateId, updateStateDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: stateId },
      });
      expect(repository.merge).toHaveBeenCalledWith(
        existingState,
        updateStateDto,
      );
      expect(repository.save).toHaveBeenCalledWith(existingState);
      expect(result).toEqual(mergedState);
    });

    it('should throw NotFoundException if state is not found during update', async () => {
      const stateId = 1;
      const updateStateDto: UpdateStateDto = { name: 'Updated Test State' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(stateId, updateStateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: stateId },
      });
    });
  });

  describe('remove', () => {
    it('should remove a state', async () => {
      const stateId = 1;
      const existingState: State = {
        id: stateId,
        name: 'São Paulo',
        abbreviation: 'SP',
        cities: [],
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingState);
      jest.spyOn(repository, 'remove').mockResolvedValue(existingState); // Retorna o estado removido

      await service.remove(stateId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: stateId },
      });
      expect(repository.remove).toHaveBeenCalledWith(existingState);
    });

    it('should throw NotFoundException if state is not found during remove', async () => {
      const stateId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(stateId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: stateId },
      });
    });
  });
});
