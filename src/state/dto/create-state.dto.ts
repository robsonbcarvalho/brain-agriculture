import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateStateDto {
  @ApiProperty({ description: 'State Name', example: 'São Paulo' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'State abbreviation', example: 'SP' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  abbreviation: string;
}
