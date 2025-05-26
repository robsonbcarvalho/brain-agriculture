import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducerModule } from './producer/producer.module';
import { CityModule } from './city/city.module';
import { StateModule } from './state/state.module';
import { SeasonModule } from './season/season.module';
import { CropModule } from './crop/crop.module';
import { FarmModule } from './farm/farm.module';
import { PlantingModule } from './planting/planting.module';
import { MorganMiddleware } from './middleware/morgan.middleware';
import { AppLogger } from './logger/logger.service';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { QueryFailedExceptionFilter } from './filters/query-failed.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 's9Kj@14lnY5',
      database: process.env.POSTGRES_DB || 'brain-agriculture',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      synchronize: false,
    }),
    ProducerModule,
    CityModule,
    StateModule,
    SeasonModule,
    CropModule,
    FarmModule,
    PlantingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    AppLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: QueryFailedExceptionFilter,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('*'); // middleware em todas as rotas
  }
}
