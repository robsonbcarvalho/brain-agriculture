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
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './city.entity';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: City,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createCityDto: CreateCityDto): Promise<City> {
    return this.cityService.create(createCityDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'The records have been successfully retrieved.',
    type: [City],
  })
  async findAll(): Promise<City[]> {
    return this.cityService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    type: City,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<City> {
    return this.cityService.findOne(id);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: City,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCityDto: UpdateCityDto,
  ): Promise<City> {
    return this.cityService.update(id, updateCityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content em caso de sucesso
  @ApiOkResponse({ description: 'The record has been successfully deleted.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cityService.remove(id);
  }
}
