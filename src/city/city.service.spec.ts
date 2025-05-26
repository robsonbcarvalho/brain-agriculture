import { Test, TestingModule } from '@nestjs/testing';
import { CityService } from './city.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { City } from './city.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { State } from '../state/state.entity';

describe('CityService', () => {
  let service: CityService;
  let repository: Repository<City>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: getRepositoryToken(City),
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

    service = module.get<CityService>(CityService);
    repository = module.get<Repository<City>>(getRepositoryToken(City));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a city and return it', async () => {
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

      jest.spyOn(repository, 'create').mockReturnValue(expectedCity);
      jest.spyOn(repository, 'save').mockResolvedValue(expectedCity);

      const result = await service.create(createCityDto);

      expect(repository.create).toHaveBeenCalledWith(createCityDto);
      expect(repository.save).toHaveBeenCalledWith(expectedCity);
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

      jest.spyOn(repository, 'find').mockResolvedValue(expectedCities);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
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

      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedCity);

      const result = await service.findOne(cityId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: cityId },
        relations: ['state'],
      });
      expect(result).toEqual(expectedCity);
    });

    it('should throw NotFoundException if city is not found', async () => {
      const cityId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(cityId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: cityId },
        relations: ['state'],
      });
    });
  });

  describe('update', () => {
    it('should update a city and return the updated city', async () => {
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

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingCity);
      jest
        .spyOn(repository, 'merge')
        .mockImplementation((entity: any, updateEntity: any) => {
          Object.assign(entity, updateEntity);
          return entity;
        });
      jest.spyOn(repository, 'save').mockResolvedValue(existingCity);

      const result = await service.update(cityId, updateCityDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: cityId },
        relations: ['state'],
      });
      expect(repository.merge).toHaveBeenCalledWith(
        existingCity,
        updateCityDto,
      );
      expect(repository.save).toHaveBeenCalledWith(existingCity);
      expect(result).toEqual(updatedCity);
    });

    it('should throw NotFoundException if city is not found during update', async () => {
      const cityId = 1;
      const updateCityDto: UpdateCityDto = { name: 'Updated Test City' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(cityId, updateCityDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: cityId },
        relations: ['state'],
      });
    });
  });

  describe('remove', () => {
    it('should remove a city', async () => {
      const createStateDto = {
        id: 1,
        name: 'São Paulo',
        abbreviation: 'SP',
        cities: [],
      };
      const createState: State = createStateDto as State;

      const cityId = 1;
      const existingCity: City = {
        id: cityId,
        name: 'São Paulo',
        stateId: createState.id,
        state: createState,
        farms: [],
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingCity);
      jest.spyOn(repository, 'remove').mockResolvedValue(existingCity);

      await service.remove(cityId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: cityId },
        relations: ['state'],
      });
      expect(repository.remove).toHaveBeenCalledWith(existingCity);
    });

    it('should throw NotFoundException if city is not found during remove', async () => {
      const cityId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(cityId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: cityId },
        relations: ['state'],
      });
    });
  });
});
