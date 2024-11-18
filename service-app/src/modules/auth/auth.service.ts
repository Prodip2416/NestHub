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
    const user = await this.userRepository.findOne({ where: { email } });

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
    };

    // 5. Generate JWT token
    const token = this.jwtService.sign(payload, {
      expiresIn: '1h',  // Set token expiration (can be customized)
    });

    // 6. Return the token and user data
    return { token, user };
  }

  // A method to get the user from the token (for future requests)
  async getUserFromToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token['userToken']); // Verify and decode the token
      return decoded;  // Return decoded user info
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  validateToken(token: string): any {
    try {
      const user = this.jwtService.verify(token); // Decode and verify the token
      return user; // Return user data from the token
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
