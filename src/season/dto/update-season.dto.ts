import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UpdateSeasonDto {
  @ApiProperty({ description: 'Season Name', example: '2022/2023' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  year: string;
}
