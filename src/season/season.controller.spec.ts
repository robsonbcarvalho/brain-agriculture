import { Test, TestingModule } from '@nestjs/testing';
import { SeasonController } from './season.controller';
import { SeasonService } from './season.service';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { Season } from './season.entity';
import { NotFoundException } from '@nestjs/common';

type MockSeason = Omit<Season, 'plantings'>;

describe('SeasonController', () => {
  let controller: SeasonController;
  let service: SeasonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeasonController],
      providers: [
        {
          provide: SeasonService,
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

    controller = module.get<SeasonController>(SeasonController);
    service = module.get<SeasonService>(SeasonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a season', async () => {
      const createSeasonDto: CreateSeasonDto = { year: '2023/2024' };
      const expectedSeason: MockSeason = { id: 1, ...createSeasonDto };

      (service.create as jest.Mock).mockResolvedValue(expectedSeason as Season);

      const result = await controller.create(createSeasonDto);

      expect(service.create).toHaveBeenCalledWith(createSeasonDto);
      expect(result).toEqual(expectedSeason);
    });
  });

  describe('findAll', () => {
    it('should return all seasons', async () => {
      const expectedSeasons: MockSeason[] = [
        { id: 1, year: '2023/2024' },
        { id: 2, year: '2024/2025' },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(
        expectedSeasons as Season[],
      );

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedSeasons);
    });
  });

  describe('findOne', () => {
    it('should return a season by id', async () => {
      const seasonId = 1;
      const expectedSeason: MockSeason = { id: seasonId, year: '2023/2024' };

      (service.findOne as jest.Mock).mockResolvedValue(
        expectedSeason as Season,
      );

      const result = await controller.findOne(seasonId);

      expect(service.findOne).toHaveBeenCalledWith(seasonId);
      expect(result).toEqual(expectedSeason);
    });

    it('should throw NotFoundException if season is not found', async () => {
      const seasonId = 1;

      (service.findOne as jest.Mock).mockRejectedValue(
        new NotFoundException(`Season with ID "${seasonId}" not found`),
      );

      await expect(controller.findOne(seasonId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(seasonId);
    });
  });

  describe('update', () => {
    it('should update a season', async () => {
      const seasonId = 1;
      const updateSeasonDto: UpdateSeasonDto = { year: '2024/2025' };
      const existingSeason: MockSeason = { id: seasonId, year: '2023/2024' };
      const updatedSeason: MockSeason = {
        ...existingSeason,
        ...updateSeasonDto,
      };

      (service.update as jest.Mock).mockResolvedValue(updatedSeason as Season);

      const result = await controller.update(seasonId, updateSeasonDto);

      expect(service.update).toHaveBeenCalledWith(seasonId, updateSeasonDto);
      expect(result).toEqual(updatedSeason);
    });

    it('should throw NotFoundException if season is not found', async () => {
      const seasonId = 1;
      const updateSeasonDto: UpdateSeasonDto = { year: '2024/2025' };

      (service.update as jest.Mock).mockRejectedValue(
        new NotFoundException(`Season with ID "${seasonId}" not found`),
      );

      await expect(
        controller.update(seasonId, updateSeasonDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(seasonId, updateSeasonDto);
    });
  });

  describe('remove', () => {
    it('should remove a season', async () => {
      const seasonId = 1;

      (service.remove as jest.Mock).mockResolvedValue(undefined);

      await controller.remove(seasonId);

      expect(service.remove).toHaveBeenCalledWith(seasonId);
    });

    it('should throw NotFoundException if season is not found', async () => {
      const seasonId = 1;

      (service.remove as jest.Mock).mockRejectedValue(
        new NotFoundException(`Season with ID "${seasonId}" not found`),
      );

      await expect(controller.remove(seasonId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith(seasonId);
    });
  });
});
