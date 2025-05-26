import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSeasonDto {
  @ApiProperty({ description: 'Season Name', example: '2022/2023' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  year: string;
}
