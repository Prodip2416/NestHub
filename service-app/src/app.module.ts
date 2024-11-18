import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { ProductsModule } from './modules/product/products.module';
import { CustomTypeOrmLogger } from './common/middlewares/CustomTypeOrmLogger.middleware';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/GlobalException.filter';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql' | 'mssql' | 'postgres' | 'mongodb',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
      entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
      // logging: ['query'],
      // logging: true,
      // logger: new CustomTypeOrmLogger(),
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [ AppService],
})
export class AppModule {}
