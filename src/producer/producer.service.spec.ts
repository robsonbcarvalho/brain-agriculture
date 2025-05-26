import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from './producer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Producer } from './producer.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';

type MockProducer = Omit<Producer, 'farms'>;

describe('ProducerService', () => {
  let service: ProducerService;
  let repository: Repository<Producer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        {
          provide: getRepositoryToken(Producer),
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

    service = module.get<ProducerService>(ProducerService);
    repository = module.get<Repository<Producer>>(getRepositoryToken(Producer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a producer', async () => {
    const createProducerDto = {
      cpfCnpj: '512.342.040-10',
      name: 'Bruno Mezenga',
      isActive: true,
    };
    const expectedProducer: MockProducer = { id: 1, ...createProducerDto };

    jest
      .spyOn(repository, 'create')
      .mockReturnValue(expectedProducer as Producer);
    jest
      .spyOn(repository, 'save')
      .mockResolvedValue(expectedProducer as Producer);

    const result = await service.create(createProducerDto);

    expect(repository.create).toHaveBeenCalledWith(createProducerDto);
    expect(repository.save).toHaveBeenCalledWith(expectedProducer);
    expect(result).toEqual(expectedProducer);
  });

  describe('findAll', () => {
    it('should return all producers', async () => {
      const expectedProducers: MockProducer[] = [
        {
          id: 1,
          cpfCnpj: '512.342.040-10',
          name: 'Bruno Mezenga',
          isActive: true,
        },
        {
          id: 2,
          cpfCnpj: '451.933.380-62',
          name: 'Antonio Berdinazi',
          isActive: true,
        },
      ];

      jest
        .spyOn(repository, 'find')
        .mockResolvedValue(expectedProducers as Producer[]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedProducers);
    });
  });

  describe('findOne', () => {
    it('should return a producer by id', async () => {
      const producerId = 1;
      const expectedProducer: MockProducer = {
        id: producerId,
        cpfCnpj: '512.342.040-10',
        name: 'Bruno Mezenga',
        isActive: true,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(expectedProducer as Producer);

      const result = await service.findOne(producerId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: producerId },
      });
      expect(result).toEqual(expectedProducer);
    });

    it('should throw NotFoundException if producer is not found', async () => {
      const producerId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(producerId)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: producerId },
      });
    });
  });

  describe('update', () => {
    it('should update a producer', async () => {
      const producerId = 1;
      const updateProducerDto: UpdateProducerDto = {
        name: 'Bruno Mesenga',
      };
      const existingProducer: MockProducer = {
        id: producerId,
        cpfCnpj: '512.342.040-10',
        name: 'Bruno Mezenga',
        isActive: true,
      };
      const updatedProducer: MockProducer = {
        ...existingProducer,
        ...updateProducerDto,
      };

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(existingProducer as Producer);
      jest
        .spyOn(repository, 'merge')
        .mockImplementation((entity: any, updateEntity: any) => {
          Object.assign(entity, updateEntity);
          return entity;
        });
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(updatedProducer as Producer);

      const result = await service.update(producerId, updateProducerDto);

      expect(service.findOne).toHaveBeenCalledWith(producerId);
      expect(repository.merge).toHaveBeenCalledWith(
        existingProducer,
        updateProducerDto,
      );
      expect(repository.save).toHaveBeenCalledWith(existingProducer);
      expect(result).toEqual(updatedProducer);
    });

    it('should throw NotFoundException if producer is not found', async () => {
      const producerId = 1;
      const updateProducerDto: UpdateProducerDto = {
        name: 'Carlos Alberto',
      };

      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException(`Producer with ID "${producerId}" not found`),
        );

      await expect(
        service.update(producerId, updateProducerDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(producerId);
    });
  });

  describe('remove', () => {
    it('should remove a producer', async () => {
      const producerId = 1;
      const existingProducer: MockProducer = {
        id: producerId,
        cpfCnpj: '512.342.040-10',
        name: 'Bruno Mezenga',
        isActive: true,
      };

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(existingProducer as Producer);
      jest
        .spyOn(repository, 'remove')
        .mockResolvedValue(existingProducer as Producer);

      await service.remove(producerId);

      expect(service.findOne).toHaveBeenCalledWith(producerId);
      expect(repository.remove).toHaveBeenCalledWith(existingProducer);
    });

    it('should throw NotFoundException if producer is not found', async () => {
      const producerId = 1;

      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException(`Producer with ID "${producerId}" not found`),
        );

      await expect(service.remove(producerId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(producerId);
    });
  });
});
