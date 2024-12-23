import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { ProductsModule } from './modules/product/products.module';
import { PermissionsModule } from './modules/permission/permission.module';
import { RolesModule } from './modules/role/role.module';
import { UsersModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/strategies/AuthGuard';
import { JwtModule } from '@nestjs/jwt';

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
    }),
    PermissionsModule,
    RolesModule,
    UsersModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, 
      signOptions: { expiresIn: '1h' }, 
      global: true 
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [ AppService, JwtAuthGuard],
})
export class AppModule {}


