import { Test, TestingModule } from '@nestjs/testing';
import { StateController } from './state.controller';
import { StateService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { State } from './state.entity';
import { NotFoundException } from '@nestjs/common';

describe('StateController', () => {
  let controller: StateController;
  let service: StateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [
        {
          provide: StateService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StateController>(StateController);
    service = module.get<StateService>(StateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a state', async () => {
      const createStateDto: CreateStateDto = { name: 'São Paulo', abbreviation: 'SP' };
      const expectedState: State = { id: 1, ...createStateDto, cities: [] };

      (service.create as jest.Mock).mockResolvedValue(expectedState);

      const result = await controller.create(createStateDto);

      expect(service.create).toHaveBeenCalledWith(createStateDto);
      expect(result).toEqual(expectedState);
    });
  });

  describe('findAll', () => {
    it('should return all states', async () => {
      const expectedStates: State[] = [
        { id: 1, name: 'Sao Paulo', abbreviation: 'SP', cities: [] },
        { id: 2, name: 'São Paulo', abbreviation: 'SP', cities: [] },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(expectedStates);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
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

      (service.findOne as jest.Mock).mockResolvedValue(expectedState);

      const result = await controller.findOne(stateId);

      expect(service.findOne).toHaveBeenCalledWith(stateId);
      expect(result).toEqual(expectedState);
    });

    it('should throw NotFoundException if state is not found', async () => {
      const stateId = 1;

      (service.findOne as jest.Mock).mockRejectedValue(
        new NotFoundException(`State with ID "${stateId}" not found`),
      );

      await expect(controller.findOne(stateId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(stateId);
    });
  });

  describe('update', () => {
    it('should update a state', async () => {
      const stateId = 1;
      const updateStateDto: UpdateStateDto = { name: 'Updated Test State' };
      const existingState: State = {
        id: stateId,
        name: 'São Paulo',
        abbreviation: 'SP',
        cities: [],
      };
      const updatedState: State = { ...existingState, ...updateStateDto };

      (service.update as jest.Mock).mockResolvedValue(updatedState);

      const result = await controller.update(stateId, updateStateDto);

      expect(service.update).toHaveBeenCalledWith(stateId, updateStateDto);
      expect(result).toEqual(updatedState);
    });

    it('should throw NotFoundException if state is not found', async () => {
      const stateId = 1;
      const updateStateDto: UpdateStateDto = { name: 'Updated Test State' };

      (service.update as jest.Mock).mockRejectedValue(
        new NotFoundException(`State with ID "${stateId}" not found`),
      );

      await expect(controller.update(stateId, updateStateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(stateId, updateStateDto);
    });
  });

  describe('remove', () => {
    it('should remove a state', async () => {
      const stateId = 1;

      (service.remove as jest.Mock).mockResolvedValue(undefined);

      await controller.remove(stateId);

      expect(service.remove).toHaveBeenCalledWith(stateId);
    });

    it('should throw NotFoundException if state is not found', async () => {
      const stateId = 1;

      (service.remove as jest.Mock).mockRejectedValue(
        new NotFoundException(`State with ID "${stateId}" not found`),
      );

      await expect(controller.remove(stateId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith(stateId);
    });
  });
});
