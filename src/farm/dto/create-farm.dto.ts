import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  Min,
  Validate,
} from 'class-validator';
import { IsValidAreaSumConstraint } from '../../validators/valid-area-sum.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmDto {
  @ApiProperty({ description: 'Farm Name', example: 'Farm 1' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Total Area (Hectares)', example: 100 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalArea: number;

  @ApiProperty({ description: 'Cultivable Area (Hectares)', example: 80 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cultivableArea: number;

  @ApiProperty({ description: 'Vegetation Area (Hectares)', example: 20 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  vegetationArea: number;

  @Validate(IsValidAreaSumConstraint)
  @ApiProperty({ description: 'Producer ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  producerId: number;

  @ApiProperty({ description: 'City ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  cityId: number;
}
