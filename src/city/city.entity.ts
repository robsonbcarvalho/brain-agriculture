import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { State } from '../state/state.entity';
import { Farm } from '../farm/farm.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('city')
export class City {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  @ApiProperty({
    description: 'City name',
    maxLength: 100,
    example: 'São Paulo',
  })
  name: string;

  @Column({ name: 'state_id', type: 'int' })
  @ApiProperty({ description: 'State ID' })
  stateId: number;

  @ManyToOne(() => State, (state) => state.cities)
  @JoinColumn({ name: 'state_id' })
  @ApiProperty({ description: 'State relation' })
  state: State;

  @OneToMany(() => Farm, (farm) => farm.city)
  farms: Farm[];
}
