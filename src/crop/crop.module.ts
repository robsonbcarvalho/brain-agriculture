import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crop } from './crop.entity';
import { CropService } from './crop.service';
import { CropController } from './crop.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Crop])],
  providers: [CropService],
  controllers: [CropController],
})
export class CropModule {}
