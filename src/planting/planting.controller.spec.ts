import { Test, TestingModule } from '@nestjs/testing';
import { PlantingController } from './planting.controller';
import { PlantingService } from './planting.service';
import { CreatePlantingDto } from './dto/create-planting.dto';
import { UpdatePlantingDto } from './dto/update-planting.dto';
import { Planting } from './planting.entity';
import { NotFoundException } from '@nestjs/common';
import { Farm } from '../farm/farm.entity';
import { Season } from '../season/season.entity';
import { Crop } from '../crop/crop.entity';

describe('PlantingController', () => {
  let controller: PlantingController;
  let service: PlantingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantingController],
      providers: [
        {
          provide: PlantingService,
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

    controller = module.get<PlantingController>(PlantingController);
    service = module.get<PlantingService>(PlantingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a planting', async () => {
      const createPlantingDto: CreatePlantingDto = {
        farmId: 1,
        seasonId: 1,
        cropId: 1,
      };

      const mockFarm = { id: 1 } as Farm;
      const mockSeason = { id: 1 } as Season;
      const mockCrop = { id: 1 } as Crop;

      const expectedPlanting: Planting = {
        id: 1,
        farm: mockFarm,
        season: mockSeason,
        crop: mockCrop,
      };

      (service.create as jest.Mock).mockResolvedValue(expectedPlanting);

      const result = await controller.create(createPlantingDto);

      expect(service.create).toHaveBeenCalledWith(createPlantingDto);
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

      (service.findAll as jest.Mock).mockResolvedValue(expectedPlantings);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
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

      (service.findOne as jest.Mock).mockResolvedValue(expectedPlanting);

      const result = await controller.findOne(plantingId);

      expect(service.findOne).toHaveBeenCalledWith(plantingId);
      expect(result).toEqual(expectedPlanting);
    });

    it('should throw NotFoundException if planting is not found', async () => {
      const plantingId = 1;

      (service.findOne as jest.Mock).mockRejectedValue(
        new NotFoundException(`Planting with ID "${plantingId}" not found`),
      );

      await expect(controller.findOne(plantingId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(plantingId);
    });
  });

  describe('update', () => {
    it('should update a planting', async () => {
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

      (service.update as jest.Mock).mockResolvedValue(updatedPlanting);

      const result = await controller.update(plantingId, updatePlantingDto);

      expect(service.update).toHaveBeenCalledWith(
        plantingId,
        updatePlantingDto,
      );
      expect(result).toEqual(updatedPlanting);
    });

    it('should throw NotFoundException if planting is not found', async () => {
      const plantingId = 1;
      const updatePlantingDto: UpdatePlantingDto = { cropId: 2 };

      (service.update as jest.Mock).mockRejectedValue(
        new NotFoundException(`Planting with ID "${plantingId}" not found`),
      );

      await expect(
        controller.update(plantingId, updatePlantingDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(
        plantingId,
        updatePlantingDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a planting', async () => {
      const plantingId = 1;

      (service.remove as jest.Mock).mockResolvedValue(undefined);

      await controller.remove(plantingId);

      expect(service.remove).toHaveBeenCalledWith(plantingId);
    });

    it('should throw NotFoundException if planting is not found', async () => {
      const plantingId = 1;

      (service.remove as jest.Mock).mockRejectedValue(
        new NotFoundException(`Planting with ID "${plantingId}" not found`),
      );

      await expect(controller.remove(plantingId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith(plantingId);
    });
  });
});
