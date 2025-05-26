import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Farm } from '../farm/farm.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('producer')
export class Producer {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  @ApiProperty({
    description: 'Producer CPF or CNPJ',
    maxLength: 20,
    example: '012.345.678-90',
  })
  cpfCnpj: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({
    description: 'Producer name',
    maxLength: 255,
    example: 'John Calvache',
  })
  name: string;

  @Column({ default: true })
  isActive?: boolean;

  @OneToMany((type) => Farm, (farm) => farm.producer)
  farms: Farm[];
}
