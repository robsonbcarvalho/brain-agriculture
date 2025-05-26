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
import { StateService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { State } from './state.entity';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('states')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: State,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createStateDto: CreateStateDto): Promise<State> {
    return this.stateService.create(createStateDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'The records have been successfully retrieved.',
    type: [State],
  })
  async findAll(): Promise<State[]> {
    return this.stateService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    type: State,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<State> {
    return this.stateService.findOne(id);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: State,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStateDto: UpdateStateDto,
  ): Promise<State> {
    return this.stateService.update(id, updateStateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: 'The record has been successfully deleted.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.stateService.remove(id);
  }
}
