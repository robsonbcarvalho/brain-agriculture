import { Test, TestingModule } from '@nestjs/testing';
import { SeasonService } from './season.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Season } from './season.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';

type MockSeason = Omit<Season, 'plantings'>;

describe('SeasonService', () => {
  let service: SeasonService;
  let repository: Repository<Season>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeasonService,
        {
          provide: getRepositoryToken(Season),
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

    service = module.get<SeasonService>(SeasonService);
    repository = module.get<Repository<Season>>(getRepositoryToken(Season));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a season and return it', async () => {
      const createSeasonDto: CreateSeasonDto = { year: '2023/2024' };
      const expectedSeason: MockSeason = { id: 1, ...createSeasonDto };

      jest
        .spyOn(repository, 'create')
        .mockReturnValue(expectedSeason as Season);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(expectedSeason as Season);

      const result = await service.create(createSeasonDto);

      expect(repository.create).toHaveBeenCalledWith(createSeasonDto);
      expect(repository.save).toHaveBeenCalledWith(expectedSeason);
      expect(result).toEqual(expectedSeason);
    });
  });

  describe('findAll', () => {
    it('should return all seasons', async () => {
      const expectedSeasons: MockSeason[] = [
        { id: 1, year: '2023/2024' },
        { id: 2, year: '2024/2025' },
      ];

      jest
        .spyOn(repository, 'find')
        .mockResolvedValue(expectedSeasons as Season[]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedSeasons);
    });
  });

  describe('findOne', () => {
    it('should return a season by id', async () => {
      const seasonId = 1;
      const expectedSeason: MockSeason = { id: seasonId, year: '2023/2024' };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(expectedSeason as Season);

      const result = await service.findOne(seasonId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: seasonId },
      });
      expect(result).toEqual(expectedSeason);
    });

    it('should throw NotFoundException if season is not found', async () => {
      const seasonId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(seasonId)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: seasonId },
      });
    });
  });

  describe('update', () => {
    it('should update a season and return the updated season', async () => {
      const seasonId = 1;
      const updateSeasonDto: UpdateSeasonDto = { year: '2024/2025' };
      const existingSeason: MockSeason = { id: seasonId, year: '2023/2024' };
      const mergedSeason: MockSeason = {
        ...existingSeason,
        ...updateSeasonDto,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(existingSeason as Season);
      jest
        .spyOn(repository, 'merge')
        .mockImplementation((entity: any, updateEntity: any) => {
          Object.assign(entity, updateEntity);
          return entity;
        });
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(existingSeason as Season);

      const result = await service.update(seasonId, updateSeasonDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: seasonId },
      });
      expect(repository.merge).toHaveBeenCalledWith(
        existingSeason,
        updateSeasonDto,
      );
      expect(repository.save).toHaveBeenCalledWith(existingSeason);
      expect(result).toEqual(mergedSeason);
    });

    it('should throw NotFoundException if season is not found during update', async () => {
      const seasonId = 1;
      const updateSeasonDto: UpdateSeasonDto = { year: '2024/2025' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(seasonId, updateSeasonDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: seasonId },
      });
    });
  });

  describe('remove', () => {
    it('should remove a season', async () => {
      const seasonId = 1;
      const existingSeason: MockSeason = { id: seasonId, year: '2023/2024' };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(existingSeason as Season);
      jest
        .spyOn(repository, 'remove')
        .mockResolvedValue(existingSeason as Season);

      await service.remove(seasonId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: seasonId },
      });
      expect(repository.remove).toHaveBeenCalledWith(existingSeason);
    });

    it('should throw NotFoundException if season is not found during remove', async () => {
      const seasonId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(seasonId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: seasonId },
      });
    });
  });
});
