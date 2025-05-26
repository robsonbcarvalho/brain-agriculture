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
import { CropService } from './crop.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Crop } from './crop.entity';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('crops')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Crop,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createCropDto: CreateCropDto): Promise<Crop> {
    return this.cropService.create(createCropDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'The records have been successfully retrieved.',
    type: [Crop],
  })
  async findAll(): Promise<Crop[]> {
    return this.cropService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    type: Crop,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Crop> {
    return this.cropService.findOne(id);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: Crop,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCropDto: UpdateCropDto,
  ): Promise<Crop> {
    return this.cropService.update(id, updateCropDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: 'The record has been successfully deleted.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cropService.remove(id);
  }
}
