import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farm } from './farm.entity';
import { FarmService } from './farm.service';
import { FarmController } from './farm.controller';
import { IsValidAreaSumConstraint } from '../validators/valid-area-sum.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Farm])],
  providers: [FarmService, IsValidAreaSumConstraint],
  controllers: [FarmController],
})
export class FarmModule {}
