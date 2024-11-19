import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'src/common/decorators/publicDecorator.decorator';
import { RolesEnum } from 'src/common/enum/RolesEnum.enum';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // for public access
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true; // Allow public access
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found! Unauthorized');
    }

    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET_KEY });
      request.user = decoded; // Token verify and decoded this

      // Fetch roles from the route's metadata---- Role wise permission
      const requiredRoles = this.reflector.get<RolesEnum[]>('roles', context.getHandler());
      if (!requiredRoles) {
        return true; // If no roles are specified, allow access
      }
      // Ensure decoded.userType is an array
      if (!Array.isArray(decoded.userType)) {
        throw new UnauthorizedException('Invalid user roles format');
      }
      // Check if the user's role matches the required roles
      if (!decoded.userType.some((role: RolesEnum) => requiredRoles.includes(role))) {
        throw new UnauthorizedException('Access denied: Insufficient permissions');
      }
      
      return true;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token signature');
      }
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}

