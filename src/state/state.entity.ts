import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { City } from '../city/city.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('state')
export class State {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  @ApiProperty({
    description: 'State name',
    maxLength: 255,
    example: 'São Paulo',
  })
  name: string;

  @Column({ type: 'varchar', length: 2, unique: true })
  @ApiProperty({ description: 'State abbreviation', maxLength: 2, example: 'SP' })
  abbreviation: string;

  @OneToMany((type) => City, (city) => city.state)
  cities: City[];
}
