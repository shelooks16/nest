import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { server } from './config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Server');
  const app = await NestFactory.create(AppModule);
  // disable in prod
  app.enableCors();
  await app.listen(server.port);
  logger.log(`Started on port ${server.port}`);
}
bootstrap();
