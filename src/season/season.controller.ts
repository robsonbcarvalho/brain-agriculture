import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SeasonService } from './season.service';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { Season } from './season.entity';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('seasons')
export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Season,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createSeasonDto: CreateSeasonDto): Promise<Season> {
    return this.seasonService.create(createSeasonDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'The records have been successfully retrieved.',
    type: [Season],
  })
  async findAll(): Promise<Season[]> {
    return this.seasonService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    type: Season,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Season> {
    return this.seasonService.findOne(id);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: Season,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSeasonDto: UpdateSeasonDto,
  ): Promise<Season> {
    return this.seasonService.update(id, updateSeasonDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content em caso de sucesso
  @ApiOkResponse({ description: 'The record has been successfully deleted.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.seasonService.remove(id);
  }
}
