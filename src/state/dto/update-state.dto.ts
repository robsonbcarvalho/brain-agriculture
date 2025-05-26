import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateStateDto {
  @ApiProperty({ description: 'State Name', example: 'São Paulo' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ description: 'State abbreviation', example: 'SP' })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  abbreviation?: string;
}
