import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class UpdateCityDto {
  @ApiProperty({
    description: 'City name',
    maxLength: 255,
    example: 'São Paulo',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ description: 'State ID', example: 1 })
  @IsOptional()
  @IsNumber()
  stateId?: number;
}
