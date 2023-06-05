import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { systemConfig } from './config/system.config';
import * as Sentry from '@sentry/node';

const validationPipe = new ValidationPipe({
  whitelist: true, // automatically remove unknown properties
  forbidNonWhitelisted: true, // throw a BadRequestException if unknown properties are present
  transform: true, // automatically transform input data to match DTO
  transformOptions: {
    enableImplicitConversion: true, // allow implicit type conversion
  },
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle(`${systemConfig.project_name} API`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  if (systemConfig.NODE_ENV === 'dev') {
    SwaggerModule.setup('docs', app, document);
  }

  if (systemConfig.NODE_ENV != 'local') {
    Sentry.init({
      environment: systemConfig.NODE_ENV || 'dev',
      dsn: systemConfig.sentry_url,
      tracesSampleRate: 1.0,
    });
  }
  app.useGlobalPipes(validationPipe);
  const port = systemConfig.port;
  await app.listen(port);
  Logger.log(`Application Working on Port ${port}`);
}
bootstrap();
