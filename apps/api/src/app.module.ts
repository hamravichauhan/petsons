import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { RfqModule } from './modules/rfq/rfq.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ComplianceModule } from './modules/compliance/compliance.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig, databaseConfig, jwtConfig], envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize: false,
        logging: false,
      }),
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    CatalogModule,
    PricingModule,
    RfqModule,
    OrdersModule,
    ComplianceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}