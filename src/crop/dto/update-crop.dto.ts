import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateCropDto {
  @ApiProperty({ description: 'Crop Name', example: 'Soja' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;
}
