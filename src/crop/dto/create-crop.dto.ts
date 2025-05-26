import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCropDto {
  @ApiProperty({ description: 'Crop Name', example: 'Soja' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;
}
