import { Test, TestingModule } from '@nestjs/testing';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { Producer } from './producer.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProducerController', () => {
  let controller: ProducerController;
  let service: ProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducerController],
      providers: [
        {
          provide: ProducerService,
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

    controller = module.get<ProducerController>(ProducerController);
    service = module.get<ProducerService>(ProducerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a producer', async () => {
      const createProducerDto: CreateProducerDto = {
        cpfCnpj: '512.342.040-10',
        name: 'Bruno Mezenga',
      };
      const expectedProducer: Producer = {
        id: 1,
        ...createProducerDto,
        farms: [],
      }; // farms pode ser []

      (service.create as jest.Mock).mockResolvedValue(expectedProducer);

      const result = await controller.create(createProducerDto);

      expect(service.create).toHaveBeenCalledWith(createProducerDto);
      expect(result).toEqual(expectedProducer);
    });
  });

  describe('findAll', () => {
    it('should return all producers', async () => {
      const expectedProducers: Producer[] = [
        { id: 1, cpfCnpj: '512.342.040-10', name: 'Bruno Mezenga', farms: [] },
        { id: 2, cpfCnpj: '451.933.380-62', name: 'Antonio Berdinazi', farms: [] },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(expectedProducers);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedProducers);
    });
  });

  describe('findOne', () => {
    it('should return a producer by id', async () => {
      const producerId = 1;
      const expectedProducer: Producer = {
        id: producerId,
        cpfCnpj: '512.342.040-10',
        name: 'Bruno Mezenga',
        isActive: true,
        farms: [],
      };

      (service.findOne as jest.Mock).mockResolvedValue(expectedProducer);

      const result = await controller.findOne(producerId);

      expect(service.findOne).toHaveBeenCalledWith(producerId);
      expect(result).toEqual(expectedProducer);
    });

    it('should throw NotFoundException if producer is not found', async () => {
      const producerId = 1;

      (service.findOne as jest.Mock).mockRejectedValue(
        new NotFoundException(`Producer with ID "${producerId}" not found`),
      );

      await expect(controller.findOne(producerId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(producerId);
    });
  });

  describe('update', () => {
    it('should update a producer', async () => {
      const producerId = 1;
      const updateProducerDto: UpdateProducerDto = {
        name: 'Bruno Mesenga',
      };
      const expectedProducer: Producer = {
        id: producerId,
        cpfCnpj: '512.342.040-10',
        name: 'Bruno Mezenga',
        farms: [],
      }; // name atualizado

      (service.update as jest.Mock).mockResolvedValue(expectedProducer);

      const result = await controller.update(producerId, updateProducerDto);

      expect(service.update).toHaveBeenCalledWith(
        producerId,
        updateProducerDto,
      );
      expect(result).toEqual(expectedProducer);
    });

    it('should throw NotFoundException if producer is not found', async () => {
      const producerId = 1;
      const updateProducerDto: UpdateProducerDto = {
        name: 'Carlos Alberto',
      };

      (service.update as jest.Mock).mockRejectedValue(
        new NotFoundException(`Producer with ID "${producerId}" not found`),
      );

      await expect(
        controller.update(producerId, updateProducerDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(
        producerId,
        updateProducerDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a producer', async () => {
      const producerId = 1;

      (service.remove as jest.Mock).mockResolvedValue(undefined);

      await controller.remove(producerId);

      expect(service.remove).toHaveBeenCalledWith(producerId);
    });

    it('should throw NotFoundException if producer is not found', async () => {
      const producerId = 1;

      (service.remove as jest.Mock).mockRejectedValue(
        new NotFoundException(`Producer with ID "${producerId}" not found`),
      );

      await expect(controller.remove(producerId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith(producerId);
    });
  });
});
