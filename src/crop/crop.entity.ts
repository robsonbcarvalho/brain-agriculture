import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Planting } from '../planting/planting.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('crop')
export class Crop {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  @ApiProperty({ description: 'Crop name', maxLength: 100, example: 'Soja' })
  name: string;

  @OneToMany(() => Planting, (planting) => planting.crop)
  plantings: Planting[];
}
