import { Test, TestingModule } from '@nestjs/testing';
import { CropService } from './crop.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Crop } from './crop.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

describe('CropService', () => {
  let service: CropService;
  let repository: Repository<Crop>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropService,
        {
          provide: getRepositoryToken(Crop),
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

    service = module.get<CropService>(CropService);
    repository = module.get<Repository<Crop>>(getRepositoryToken(Crop));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a crop and return it', async () => {
      const createCropDto: CreateCropDto = { name: 'Soja' };
      const expectedCrop: Crop = { id: 1, ...createCropDto, plantings: [] };

      jest.spyOn(repository, 'create').mockReturnValue(expectedCrop);
      jest.spyOn(repository, 'save').mockResolvedValue(expectedCrop);

      const result = await service.create(createCropDto);

      expect(repository.create).toHaveBeenCalledWith(createCropDto);
      expect(repository.save).toHaveBeenCalledWith(expectedCrop);
      expect(result).toEqual(expectedCrop);
    });
  });

  describe('findAll', () => {
    it('should return all crops', async () => {
      const expectedCrops: Crop[] = [
        { id: 1, name: 'Soja', plantings: [] },
        { id: 2, name: 'Milho', plantings: [] },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(expectedCrops);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedCrops);
    });
  });

  describe('findOne', () => {
    it('should return a crop by id', async () => {
      const cropId = 1;
      const expectedCrop: Crop = { id: cropId, name: 'Soja', plantings: [] };

      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedCrop);

      const result = await service.findOne(cropId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: cropId },
      });
      expect(result).toEqual(expectedCrop);
    });

    it('should throw NotFoundException if crop is not found', async () => {
      const cropId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(cropId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: cropId },
      });
    });
  });

  describe('update', () => {
    it('should update a crop and return the updated crop', async () => {
      const cropId = 1;
      const updateCropDto: UpdateCropDto = { name: 'Soja' };
      const existingCrop: Crop = { id: cropId, name: 'Soj', plantings: [] };
      const updatedCrop: Crop = { ...existingCrop, ...updateCropDto };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingCrop);
      jest
        .spyOn(repository, 'merge')
        .mockImplementation((entity: any, updateEntity: any) => {
          Object.assign(entity, updateEntity);
          return entity;
        });
      jest.spyOn(repository, 'save').mockResolvedValue(existingCrop); //salva existingCrop

      const result = await service.update(cropId, updateCropDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: cropId },
      });
      expect(repository.merge).toHaveBeenCalledWith(
        existingCrop,
        updateCropDto,
      );
      expect(repository.save).toHaveBeenCalledWith(existingCrop); //verifica se existingCrop está sendo chamado
      expect(result).toEqual(updatedCrop);
    });

    it('should throw NotFoundException if crop is not found during update', async () => {
      const cropId = 1;
      const updateCropDto: UpdateCropDto = { name: 'Soja 2' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(cropId, updateCropDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: cropId },
      });
    });
  });

  describe('remove', () => {
    it('should remove a crop', async () => {
      const cropId = 1;
      const existingCrop: Crop = { id: cropId, name: 'Soja', plantings: [] };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingCrop);
      jest.spyOn(repository, 'remove').mockResolvedValue(existingCrop);

      await service.remove(cropId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: cropId },
      });
      expect(repository.remove).toHaveBeenCalledWith(existingCrop);
    });

    it('should throw NotFoundException if crop is not found during remove', async () => {
      const cropId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(cropId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: cropId },
      });
    });
  });
});
