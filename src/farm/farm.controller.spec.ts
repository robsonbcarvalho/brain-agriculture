import { Test, TestingModule } from '@nestjs/testing';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Farm } from './farm.entity';
import { NotFoundException } from '@nestjs/common';
import { Producer } from '../producer/producer.entity';
import { City } from '../city/city.entity';

// Define um tipo para o objeto de teste que torna o atributo 'plantings' opcional
type MockFarm = Omit<Farm, 'plantings'>;

describe('FarmController', () => {
  let controller: FarmController;
  let service: FarmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmController],
      providers: [
        {
          provide: FarmService,
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

    controller = module.get<FarmController>(FarmController);
    service = module.get<FarmService>(FarmService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a farm', async () => {
      const createFarmDto: CreateFarmDto = {
        name: 'Fazenda Primavera',
        totalArea: 100,
        cultivableArea: 50,
        vegetationArea: 50,
        producerId: 1,
        cityId: 1,
      };

      const expectedFarm: MockFarm = {
        id: 1,
        ...createFarmDto,
      };

      (service.create as jest.Mock).mockResolvedValue(expectedFarm as Farm);

      const result = await controller.create(createFarmDto);

      expect(service.create).toHaveBeenCalledWith(createFarmDto);
      expect(result).toEqual(expectedFarm);
    });
  });

  describe('findAll', () => {
    it('should return all farms', async () => {
      const mockProducer = { id: 1 } as Producer;
      const mockCity = { id: 1 } as City;

      const expectedFarms: MockFarm[] = [
        {
          id: 1,
          name: 'Fazenda Primavera',
          totalArea: 100,
          cultivableArea: 50,
          vegetationArea: 50,
          producer: mockProducer,
          cityId: 1,
          producerId: 1,
        },
        {
          id: 2,
          name: 'Fazenda Recanto Verde',
          totalArea: 200,
          cultivableArea: 100,
          vegetationArea: 100,
          cityId: 2,
          producerId: 2,
        },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(expectedFarms as Farm[]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedFarms);
    });
  });

  describe('findOne', () => {
    it('should return a farm by id', async () => {
      const farmId = 1;
      const expectedFarm: MockFarm = {
        id: farmId,
        name: 'Fazenda Primavera',
        totalArea: 100,
        cultivableArea: 50,
        vegetationArea: 50,
        producerId: 1,
        cityId: 1,
      };

      (service.findOne as jest.Mock).mockResolvedValue(expectedFarm as Farm);

      const result = await controller.findOne(farmId);

      expect(service.findOne).toHaveBeenCalledWith(farmId);
      expect(result).toEqual(expectedFarm);
    });

    it('should throw NotFoundException if farm is not found', async () => {
      const farmId = 1;

      (service.findOne as jest.Mock).mockRejectedValue(
        new NotFoundException(`Farm with ID "${farmId}" not found`),
      );

      await expect(controller.findOne(farmId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(farmId);
    });
  });

  describe('update', () => {
    it('should update a farm', async () => {
      const farmId = 1;
      const updateFarmDto: UpdateFarmDto = { name: 'Updated Test Farm' };
      const existingFarm: MockFarm = {
        id: farmId,
        name: 'Fazenda Primavera',
        totalArea: 100,
        cultivableArea: 50,
        vegetationArea: 50,
        producerId: 1,
        cityId: 1,
      };
      const updatedFarm: MockFarm = { ...existingFarm, ...updateFarmDto };

      (service.update as jest.Mock).mockResolvedValue(updatedFarm as Farm);

      const result = await controller.update(farmId, updateFarmDto);

      expect(service.update).toHaveBeenCalledWith(farmId, updateFarmDto);
      expect(result).toEqual(updatedFarm);
    });

    it('should throw NotFoundException if farm is not found', async () => {
      const farmId = 1;
      const updateFarmDto: UpdateFarmDto = { name: 'Updated Test Farm' };

      (service.update as jest.Mock).mockRejectedValue(
        new NotFoundException(`Farm with ID "${farmId}" not found`),
      );

      await expect(controller.update(farmId, updateFarmDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(farmId, updateFarmDto);
    });
  });

  describe('remove', () => {
    it('should remove a farm', async () => {
      const farmId = 1;

      (service.remove as jest.Mock).mockResolvedValue(undefined);

      await controller.remove(farmId);

      expect(service.remove).toHaveBeenCalledWith(farmId);
    });

    it('should throw NotFoundException if farm is not found', async () => {
      const farmId = 1;

      (service.remove as jest.Mock).mockRejectedValue(
        new NotFoundException(`Farm with ID "${farmId}" not found`),
      );

      await expect(controller.remove(farmId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith(farmId);
    });
  });
});
