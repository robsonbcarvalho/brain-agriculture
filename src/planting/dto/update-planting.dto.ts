import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePlantingDto {
  @ApiProperty({ description: 'Farm ID', example: 1 })
  @IsOptional()
  @IsNumber()
  farmId?: number;

  @ApiProperty({ description: 'Season ID', example: 1 })
  @IsOptional()
  @IsNumber()
  seasonId?: number;

  @ApiProperty({ description: 'Crop ID', example: 1 })
  @IsOptional()
  @IsNumber()
  cropId?: number;
}
