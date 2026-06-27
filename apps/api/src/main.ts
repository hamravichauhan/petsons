
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true });
  app.setGlobalPrefix('api');

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port', 3002);
  await app.listen(port);
  logger.log(`PATSON API running on http://localhost:${port}/api`);
}
bootstrap();
