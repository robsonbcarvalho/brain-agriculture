import { Test, TestingModule } from '@nestjs/testing';
import { FarmService } from './farm.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Farm } from './farm.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Producer } from '../producer/producer.entity';
import { City } from '../city/city.entity';

type MockFarm = Omit<Farm, 'plantings'>;

describe('FarmService', () => {
  let service: FarmService;
  let repository: Repository<Farm>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmService,
        {
          provide: getRepositoryToken(Farm),
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

    service = module.get<FarmService>(FarmService);
    repository = module.get<Repository<Farm>>(getRepositoryToken(Farm));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a farm and return it', async () => {
      const createFarmDto: CreateFarmDto = {
        name: 'Fazenda Primavera',
        totalArea: 100,
        cultivableArea: 50,
        vegetationArea: 50,
        producerId: 1,
        cityId: 1,
      };

      const mockProducer = { id: 1 } as Producer;
      const mockCity = { id: 1 } as City;

      const expectedFarm: MockFarm = {
        id: 1,
        ...createFarmDto,
        producerId: 1,
        cityId: 1,
      };

      jest.spyOn(repository, 'create').mockReturnValue(expectedFarm as Farm);
      jest.spyOn(repository, 'save').mockResolvedValue(expectedFarm as Farm);

      const result = await service.create(createFarmDto);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createFarmDto.name,
          totalArea: createFarmDto.totalArea,
          cultivableArea: createFarmDto.cultivableArea,
          vegetationArea: createFarmDto.vegetationArea,
          cityId: createFarmDto.cityId,
        }),
      );
      expect(repository.save).toHaveBeenCalledWith(expectedFarm);
      expect(result).toEqual(expectedFarm);
    });
  });

  describe('findAll', () => {
    it('should return all farms', async () => {
      const expectedFarms: MockFarm[] = [
        {
          id: 1,
          name: 'Fazenda Primavera',
          totalArea: 100,
          cultivableArea: 50,
          vegetationArea: 50,
          producerId: 1,
          cityId: 1,
        },
        {
          id: 2,
          name: 'Fazenda Recanto Verde',
          totalArea: 200,
          cultivableArea: 100,
          vegetationArea: 100,
          producerId: 2,
          cityId: 2,
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(expectedFarms as Farm[]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['producer', 'city'],
      });
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

      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedFarm as Farm);

      const result = await service.findOne(farmId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: farmId },
        relations: ['producer', 'city'],
      });
      expect(result).toEqual(expectedFarm);
    });

    it('should throw NotFoundException if farm is not found', async () => {
      const farmId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(farmId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: farmId },
        relations: ['producer', 'city'],
      });
    });
  });

  describe('update', () => {
    it('should update a farm and return the updated farm', async () => {
      const farmId = 1;
      const updateFarmDto: UpdateFarmDto = { name: 'Fazenda Primavera' };

      const existingFarm: MockFarm = {
        id: farmId,
        name: 'Fazenda Primave',
        totalArea: 100,
        cultivableArea: 50,
        vegetationArea: 50,
        producerId: 1,
        cityId: 1,
      };
      const updatedFarm: MockFarm = { ...existingFarm, ...updateFarmDto };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingFarm as Farm);
      jest
        .spyOn(repository, 'merge')
        .mockImplementation((entity: any, updateEntity: any) => {
          Object.assign(entity, updateEntity);
          return entity;
        });
      jest.spyOn(repository, 'save').mockResolvedValue(existingFarm as Farm);

      const result = await service.update(farmId, updateFarmDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: farmId },
        relations: ['producer', 'city'],
      });
      expect(repository.merge).toHaveBeenCalledWith(
        existingFarm,
        updateFarmDto,
      );
      expect(repository.save).toHaveBeenCalledWith(existingFarm); //verifica se o save é chamado com o existingFarm
      expect(result).toEqual(updatedFarm);
    });

    it('should throw NotFoundException if farm is not found during update', async () => {
      const farmId = 1;
      const updateFarmDto: UpdateFarmDto = { name: 'Updated Test Farm' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(farmId, updateFarmDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: farmId },
        relations: ['producer', 'city'],
      });
    });
  });

  describe('remove', () => {
    it('should remove a farm', async () => {
      const mockProducer = { id: 1 } as Producer;
      const mockCity = { id: 1 } as City;
      const farmId = 1;
      const existingFarm: MockFarm = {
        id: farmId,
        name: 'Fazenda Primavera',
        totalArea: 100,
        cultivableArea: 50,
        vegetationArea: 50,
        producerId: 1,
        cityId: 1,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingFarm as Farm);
      jest.spyOn(repository, 'remove').mockResolvedValue(existingFarm as Farm);

      await service.remove(farmId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: farmId },
        relations: ['producer', 'city'],
      });
      expect(repository.remove).toHaveBeenCalledWith(existingFarm);
    });

    it('should throw NotFoundException if farm is not found during remove', async () => {
      const farmId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(farmId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: farmId },
        relations: ['producer', 'city'],
      });
    });
  });
});
