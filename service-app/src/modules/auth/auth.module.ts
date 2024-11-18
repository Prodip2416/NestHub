import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './strategies/AuthGuard';

@Module({
  imports: [
    JwtModule.register({
      secret: 'yourSecretKey', // Use environment variables in production
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
