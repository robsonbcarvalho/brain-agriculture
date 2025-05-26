import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class CreateCityDto {
  @ApiProperty({
    description: 'City name',
    maxLength: 255,
    example: 'São Paulo',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'State ID', example: 1 })
  @Column({ name: 'state_id', type: 'int' })
  @IsNotEmpty()
  @IsNumber()
  stateId: number;
}
