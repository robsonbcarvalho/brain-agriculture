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
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Farm } from './farm.entity';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('farms')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Farm,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createFarmDto: CreateFarmDto): Promise<Farm> {
    return this.farmService.create(createFarmDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'The records have been successfully retrieved.',
    type: [Farm],
  })
  async findAll(): Promise<Farm[]> {
    return this.farmService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    type: Farm,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Farm> {
    return this.farmService.findOne(id);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: Farm,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFarmDto: UpdateFarmDto,
  ): Promise<Farm> {
    return this.farmService.update(id, updateFarmDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content em caso de sucesso
  @ApiOkResponse({ description: 'The record has been successfully deleted.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.farmService.remove(id);
  }
}
