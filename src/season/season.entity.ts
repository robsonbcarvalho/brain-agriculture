import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Planting } from '../planting/planting.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('season')
export class Season {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  @ApiProperty({ description: 'Season Name', example: '2022/2023' })
  year: string;

  @ManyToOne(() => Planting, (planting) => planting.season)
  plantings: Planting;
}
