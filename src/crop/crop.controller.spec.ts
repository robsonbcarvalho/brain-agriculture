import { Test, TestingModule } from '@nestjs/testing';
import { CropController } from './crop.controller';
import { CropService } from './crop.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Crop } from './crop.entity';
import { NotFoundException } from '@nestjs/common';

describe('CropController', () => {
  let controller: CropController;
  let service: CropService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropController],
      providers: [
        {
          provide: CropService,
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

    controller = module.get<CropController>(CropController);
    service = module.get<CropService>(CropService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a crop', async () => {
      const createCropDto: CreateCropDto = { name: 'Soja' };
      const expectedCrop: Crop = { id: 1, ...createCropDto, plantings: [] };

      (service.create as jest.Mock).mockResolvedValue(expectedCrop);

      const result = await controller.create(createCropDto);

      expect(service.create).toHaveBeenCalledWith(createCropDto);
      expect(result).toEqual(expectedCrop);
    });
  });

  describe('findAll', () => {
    it('should return all crops', async () => {
      const expectedCrops: Crop[] = [
        { id: 1, name: 'Soja', plantings: [] },
        { id: 2, name: 'Milho', plantings: [] },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(expectedCrops);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedCrops);
    });
  });

  describe('findOne', () => {
    it('should return a crop by id', async () => {
      const cropId = 1;
      const expectedCrop: Crop = { id: cropId, name: 'Soja', plantings: [] };

      (service.findOne as jest.Mock).mockResolvedValue(expectedCrop);

      const result = await controller.findOne(cropId);

      expect(service.findOne).toHaveBeenCalledWith(cropId);
      expect(result).toEqual(expectedCrop);
    });

    it('should throw NotFoundException if crop is not found', async () => {
      const cropId = 1;

      (service.findOne as jest.Mock).mockRejectedValue(
        new NotFoundException(`Crop with ID "${cropId}" not found`),
      );

      await expect(controller.findOne(cropId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(cropId);
    });
  });

  describe('update', () => {
    it('should update a crop', async () => {
      const cropId = 1;
      const updateCropDto: UpdateCropDto = { name: 'Soja' };
      const existingCrop: Crop = { id: cropId, name: 'Soj', plantings: [] };
      const updatedCrop: Crop = { ...existingCrop, ...updateCropDto };

      (service.update as jest.Mock).mockResolvedValue(updatedCrop);

      const result = await controller.update(cropId, updateCropDto);

      expect(service.update).toHaveBeenCalledWith(cropId, updateCropDto);
      expect(result).toEqual(updatedCrop);
    });

    it('should throw NotFoundException if crop is not found', async () => {
      const cropId = 1;
      const updateCropDto: UpdateCropDto = { name: 'Soja 2' };

      (service.update as jest.Mock).mockRejectedValue(
        new NotFoundException(`Crop with ID "${cropId}" not found`),
      );

      await expect(controller.update(cropId, updateCropDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(cropId, updateCropDto);
    });
  });

  describe('remove', () => {
    it('should remove a crop', async () => {
      const cropId = 1;

      (service.remove as jest.Mock).mockResolvedValue(undefined);

      await controller.remove(cropId);

      expect(service.remove).toHaveBeenCalledWith(cropId);
    });

    it('should throw NotFoundException if crop is not found', async () => {
      const cropId = 1;

      (service.remove as jest.Mock).mockRejectedValue(
        new NotFoundException(`Crop with ID "${cropId}" not found`),
      );

      await expect(controller.remove(cropId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith(cropId);
    });
  });
});
