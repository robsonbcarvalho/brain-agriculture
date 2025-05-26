import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farm } from '../farm/farm.entity';
import { Season } from '../season/season.entity';
import { Crop } from '../crop/crop.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('planting')
export class Planting {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ManyToOne(() => Farm, (farm) => farm.plantings)
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @ManyToOne(() => Season, (season) => season.plantings)
  @JoinColumn({ name: 'season_id' })
  season: Season;

  @ManyToOne(() => Crop, (crop) => crop.plantings)
  @JoinColumn({ name: 'crop_id' })
  crop: Crop;
}
