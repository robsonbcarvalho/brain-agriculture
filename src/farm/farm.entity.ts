import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producer } from '../producer/producer.entity';
import { City } from '../city/city.entity';
import { Planting } from '../planting/planting.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('farm')
export class Farm {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  @ApiProperty({ description: 'Farm name', maxLength: 100, example: 'Farm 1' })
  name: string;

  @Column({ name: 'city_id', type: 'int' })
  @ApiProperty({ description: 'City ID' })
  cityId: number;

  @Column({ name: 'producer_id', type: 'int' })
  @ApiProperty({ description: 'Producer ID' })
  producerId: number;

  @ManyToOne(() => Producer, (producer) => producer.farms)
  @JoinColumn({ name: 'producer_id' })
  producer?: Producer;

  @ManyToOne(() => City, (city) => city.farms)
  @JoinColumn({ name: 'city_id' })
  city?: City;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  @ApiProperty({ description: 'Total area of the farm', example: 100.0 })
  totalArea: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  @ApiProperty({ description: 'Cultivable area of the farm', example: 80.0 })
  cultivableArea: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  @ApiProperty({ description: 'Vegetation area of the farm', example: 20.0 })
  vegetationArea: number;

  @ManyToOne(() => Planting, (planting) => planting.farm)
  @JoinColumn({ name: 'planting_id' })
  plantings?: Planting;
}
