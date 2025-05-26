import { Test, TestingModule } from '@nestjs/testing';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './city.entity';
import { NotFoundException } from '@nestjs/common';
import { State } from '../state/state.entity';

describe('CityController', () => {
  let controller: CityController;
  let service: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [
        {
          provide: CityService,
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

    controller = module.get<CityController>(CityController);
    service = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a city', async () => {
      const createStateDto = {
        id: 1,
        name: 'São Paulo',
        abbreviation: 'SP',
        cities: [],
      };
      const createState: State = createStateDto as State;

      const createCityDto: CreateCityDto = { name: 'São Paulo', stateId: 1 };
      const expectedCity: City = {
        id: 1,
        name: 'São Paulo',
        stateId: createState.id,
        state: createState,
        farms: [],
      };

      (service.create as jest.Mock).mockResolvedValue(expectedCity);

      const result = await controller.create(createCityDto);

      expect(service.create).toHaveBeenCalledWith(createCityDto);
      expect(result).toEqual(expectedCity);
    });
  });

  describe('findAll', () => {
    it('should return all cities', async () => {
      const createStateDto = {
        id: 1,
        name: 'São Paulo',
        abbreviation: 'SP',
        cities: [],
      };
      const createState: State = createStateDto as State;

      const expectedCities: City[] = [
        { id: 1, name: 'São Paulo', stateId: 1, state: createState, farms: [] },
        { id: 2, name: 'Goiânia', stateId: 2, state: createState, farms: [] },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(expectedCities);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedCities);
    });
  });

  describe('findOne', () => {
    it('should return a city by id', async () => {
      const createStateDto = {
        id: 1,
        name: 'São Paulo',
        abbreviation: 'SP',
        cities: [],
      };
      const createState: State = createStateDto as State;

      const cityId = 1;
      const expectedCity: City = {
        id: cityId,
        name: 'São Paulo',
        stateId: createState.id,
        state: createState,
        farms: [],
      };

      (service.findOne as jest.Mock).mockResolvedValue(expectedCity);

      const result = await controller.findOne(cityId);

      expect(service.findOne).toHaveBeenCalledWith(cityId);
      expect(result).toEqual(expectedCity);
    });

    it('should throw NotFoundException if city is not found', async () => {
      const cityId = 1;

      (service.findOne as jest.Mock).mockRejectedValue(
        new NotFoundException(`City with ID "${cityId}" not found`),
      );

      await expect(controller.findOne(cityId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(cityId);
    });
  });

  describe('update', () => {
    it('should update a city', async () => {
      const createStateDto = {
        id: 1,
        name: 'São Paulo',
        abbreviation: 'SP',
        cities: [],
      };
      const createState: State = createStateDto as State;

      const cityId = 1;
      const updateCityDto: UpdateCityDto = { name: 'Updated Test City' };
      const existingCity: City = {
        id: cityId,
        name: 'São Paulo',
        stateId: createState.id,
        state: createState,
        farms: [],
      };
      const updatedCity: City = { ...existingCity, ...updateCityDto };

      (service.update as jest.Mock).mockResolvedValue(updatedCity);

      const result = await controller.update(cityId, updateCityDto);

      expect(service.update).toHaveBeenCalledWith(cityId, updateCityDto);
      expect(result).toEqual(updatedCity);
    });

    it('should throw NotFoundException if city is not found', async () => {
      const cityId = 1;
      const updateCityDto: UpdateCityDto = { name: 'Updated Test City' };

      (service.update as jest.Mock).mockRejectedValue(
        new NotFoundException(`City with ID "${cityId}" not found`),
      );

      await expect(controller.update(cityId, updateCityDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(cityId, updateCityDto);
    });
  });

  describe('remove', () => {
    it('should remove a city', async () => {
      const cityId = 1;

      (service.remove as jest.Mock).mockResolvedValue(undefined);

      await controller.remove(cityId);

      expect(service.remove).toHaveBeenCalledWith(cityId);
    });

    it('should throw NotFoundException if city is not found', async () => {
      const cityId = 1;

      (service.remove as jest.Mock).mockRejectedValue(
        new NotFoundException(`City with ID "${cityId}" not found`),
      );

      await expect(controller.remove(cityId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith(cityId);
    });
  });
});
