import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
  Validate,
} from 'class-validator';
import { IsValidAreaSumConstraint } from '../../validators/valid-area-sum.validator';

export class UpdateFarmDto {
  @ApiProperty({ description: 'Farm Name', example: 'Farm 1' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ description: 'Total Area (Hectares)', example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalArea?: number;

  @ApiProperty({ description: 'Cultivable Area (Hectares)', example: 80 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cultivableArea?: number;

  @ApiProperty({ description: 'Vegetation Area (Hectares)', example: 20 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  vegetationArea?: number;

  @Validate(IsValidAreaSumConstraint)
  @ApiProperty({ description: 'Producer ID', example: 1 })
  @IsOptional()
  @IsNumber()
  producerId?: number;

  @ApiProperty({ description: 'City ID', example: 1 })
  @IsOptional()
  @IsNumber()
  cityId?: number;
}
