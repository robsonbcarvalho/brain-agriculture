import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planting } from './planting.entity';
import { PlantingService } from './planting.service';
import { PlantingController } from './planting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Planting])],
  providers: [PlantingService],
  controllers: [PlantingController],
})
export class PlantingModule {}
