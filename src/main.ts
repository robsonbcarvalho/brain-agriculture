import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger } from './logger/logger.service';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { QueryFailedExceptionFilter } from './filters/query-failed.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger(),
  });

  //app.useGlobalFilters(new QueryFailedExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Rural Producers API Docs')
    .setDescription('API for managing rural producers, farms, and crops')
    .setVersion('1.0')
    .setContact('Robson Bezerra Carvalho', '', 'robsonbcarvalho@gmail.com')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const options: SwaggerCustomOptions = {
    swaggerOptions: {
      defaultModelsExpandDepth: 0,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Rural Producers API Docs',
  };

  SwaggerModule.setup('api', app, document, options);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
