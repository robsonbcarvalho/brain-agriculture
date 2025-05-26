import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePlantingDto {
  @ApiProperty({ description: 'Farm ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  farmId: number;

  @ApiProperty({ description: 'Season ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  seasonId: number;

  @ApiProperty({ description: 'Crop ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  cropId: number;
}
