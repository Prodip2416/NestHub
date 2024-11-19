import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';  // JWT Service
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/LoginDto.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private jwtService: JwtService, // Inject JwtService
  ) {}

  // Login method
  async login(loginDto: LoginDto): Promise<{ token: string; user: any }> {
    const { email, password } = loginDto;

    // 1. Find the user by email
    const user = await this.userRepository.findOne({ where: { email }, relations: ['roles'],  });

    // 2. Check if user exists
    if (!user) {
      throw new UnauthorizedException('Invalid Email address.');
    }

    // 3. Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 4. Create JWT payload with user info and date/time
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      loginAt: new Date(),  // Adding login timestamp
      userType: user?.roles.map((role)=>role?.name)
    };

    // 5. Generate JWT token
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '1h',                
    });
    
    // 6. Return the token and user data
    return { token, user: { id: user.id, name: user.name, email: user.email, roles: user.roles } };
  }

  // A method to get the user from the token (for future requests)
  async getUserFromToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token['userToken'], { secret: process.env.JWT_SECRET_KEY });
      return decoded;  // Return decoded user info
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

}
