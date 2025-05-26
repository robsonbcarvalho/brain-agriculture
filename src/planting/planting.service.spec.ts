import { Test, TestingModule } from '@nestjs/testing';
import { PlantingService } from './planting.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Planting } from './planting.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreatePlantingDto } from './dto/create-planting.dto';
import { UpdatePlantingDto } from './dto/update-planting.dto';
import { Farm } from '../farm/farm.entity';
import { Season } from '../season/season.entity';
import { Crop } from '../crop/crop.entity';

describe('PlantingService', () => {
  let service: PlantingService;
  let repository: Repository<Planting>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantingService,
        {
          provide: getRepositoryToken(Planting),
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

    service = module.get<PlantingService>(PlantingService);
    repository = module.get<Repository<Planting>>(getRepositoryToken(Planting));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a planting and return it', async () => {
      const createPlantingDto: CreatePlantingDto = {
        farmId: 1,
        seasonId: 1,
        cropId: 1,
      };

      const expectedPlanting: Planting = {
        id: 1,
        farm: { id: createPlantingDto.farmId },
        season: { id: createPlantingDto.seasonId },
        crop: { id: createPlantingDto.cropId },
      } as Planting;

      jest.spyOn(repository, 'create').mockReturnValue(expectedPlanting);
      jest.spyOn(repository, 'save').mockResolvedValue(expectedPlanting);

      const result = await service.create(createPlantingDto);

      expect(repository.create).toHaveBeenCalledWith({
        farm: { id: createPlantingDto.farmId },
        season: { id: createPlantingDto.seasonId },
        crop: { id: createPlantingDto.cropId },
      });
      expect(repository.save).toHaveBeenCalledWith(expectedPlanting);
      expect(result).toEqual(expectedPlanting);
    });
  });

  describe('findAll', () => {
    it('should return all plantings', async () => {
      const mockFarm = { id: 1 } as Farm;
      const mockSeason = { id: 1 } as Season;
      const mockCrop = { id: 1 } as Crop;

      const expectedPlantings: Planting[] = [
        { id: 1, farm: mockFarm, season: mockSeason, crop: mockCrop },
        { id: 2, farm: mockFarm, season: mockSeason, crop: mockCrop },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(expectedPlantings);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedPlantings);
    });
  });

  describe('findOne', () => {
    it('should return a planting by id', async () => {
      const mockFarm = { id: 1 } as Farm;
      const mockSeason = { id: 1 } as Season;
      const mockCrop = { id: 1 } as Crop;
      const plantingId = 1;
      const expectedPlanting: Planting = {
        id: plantingId,
        farm: mockFarm,
        season: mockSeason,
        crop: mockCrop,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedPlanting);

      const result = await service.findOne(plantingId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: plantingId },
        relations: ['farm', 'season', 'crop'],
      });
      expect(result).toEqual(expectedPlanting);
    });

    it('should throw NotFoundException if planting is not found', async () => {
      const plantingId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(plantingId)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: plantingId },
        relations: ['farm', 'season', 'crop'],
      });
    });
  });

  describe('update', () => {
    it('should update a planting and return the updated planting', async () => {
      const plantingId = 1;
      const updatePlantingDto: UpdatePlantingDto = { cropId: 2 };

      const mockFarm = { id: 1 } as Farm;
      const mockSeason = { id: 1 } as Season;
      const mockCrop1 = { id: 1 } as Crop;
      const mockCrop2 = { id: 2 } as Crop;

      const existingPlanting: Planting = {
        id: plantingId,
        farm: mockFarm,
        season: mockSeason,
        crop: mockCrop1,
      };
      const updatedPlanting: Planting = {
        ...existingPlanting,
        crop: mockCrop2,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingPlanting);
      jest
        .spyOn(repository, 'merge')
        .mockImplementation((entity: any, updateEntity: any) => {
          Object.assign(entity, updateEntity);
          return entity;
        });
      jest.spyOn(repository, 'save').mockResolvedValue(existingPlanting);

      const result = await service.update(plantingId, updatePlantingDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: plantingId },
        relations: ['farm', 'season', 'crop'],
      });
      expect(repository.merge).toHaveBeenCalledWith(existingPlanting, {
        crop: { id: updatePlantingDto.cropId },
      });
      expect(repository.save).toHaveBeenCalledWith(existingPlanting);
      expect(result).toEqual(updatedPlanting);
    });

    it('should throw NotFoundException if planting is not found during update', async () => {
      const plantingId = 1;
      const updatePlantingDto: UpdatePlantingDto = { cropId: 2 };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.update(plantingId, updatePlantingDto),
      ).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: plantingId },
        relations: ['farm', 'season', 'crop'],
      });
    });
  });

  describe('remove', () => {
    it('should remove a planting', async () => {
      const mockFarm = { id: 1 } as Farm;
      const mockSeason = { id: 1 } as Season;
      const mockCrop = { id: 1 } as Crop;
      const plantingId = 1;
      const existingPlanting: Planting = {
        id: plantingId,
        farm: mockFarm,
        season: mockSeason,
        crop: mockCrop,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingPlanting);
      jest.spyOn(repository, 'remove').mockResolvedValue(existingPlanting);

      await service.remove(plantingId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: plantingId },
        relations: ['farm', 'season', 'crop'],
      });
      expect(repository.remove).toHaveBeenCalledWith(existingPlanting);
    });

    it('should throw NotFoundException if planting is not found during remove', async () => {
      const plantingId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(plantingId)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: plantingId },
        relations: ['farm', 'season', 'crop'],
      });
    });
  });
});
