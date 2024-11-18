import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../role/entity/role.entity';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { UserResponseDto } from './dto/UserResponseDto.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const allUsers = await this.userRepository.find({
        relations: ['roles'], 
      });
    
    return plainToInstance(UserResponseDto, allUsers, { excludeExtraneousValues: true });
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    console.log({user})
  
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  
    // Map the entity to the DTO
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if the email already exists
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new BadRequestException('Email already in use.');
    }

    // Fetch roles by IDs
    const roles = createUserDto.roles?.length
      ? await this.roleRepository.findByIds(createUserDto.roles)
      : [];

    if (createUserDto.roles?.length && roles.length !== createUserDto.roles.length) {
      throw new BadRequestException('Roles not found.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create the user entity
    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      address: createUserDto.address,
      phoneNumber: createUserDto.phoneNumber,
      isActive: createUserDto.isActive ?? true, // Default to true if not provided
      roles, // Assign roles
      createdAt: new Date(),
    });

    // Save the user to the database
    const saveUser = this.userRepository.save(user);
    return plainToInstance(UserResponseDto, saveUser, { excludeExtraneousValues: true });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // Find the existing user
    const user = await this.userRepository.findOne({ where: { id }, relations: ['roles'] });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Check if the email already exists
    if(updateUserDto.email){
      const existingUser = await this.userRepository.findOne({ where: { email: updateUserDto.email } });
      if(existingUser?.id !== user?.id){
        if (existingUser) {
          throw new BadRequestException('Email already in use.');
        }
      }
    }
    

    // Validate and fetch roles if provided
    let roles = user.roles; // Keep existing roles if not provided
    if (updateUserDto.roles) {
      roles = await this.roleRepository.findByIds(updateUserDto.roles);
      if (roles.length !== updateUserDto.roles.length) {
        throw new BadRequestException('One or more roles not found');
      }
    }

    // Update fields only if provided in the DTO
    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (updateUserDto.address) user.address = updateUserDto.address;
    if (updateUserDto.phoneNumber) user.phoneNumber = updateUserDto.phoneNumber;
    if (updateUserDto.isActive !== undefined) user.isActive = updateUserDto.isActive;
    if (updateUserDto.refreshToken !== undefined) user.refreshToken = updateUserDto.refreshToken;
    if (updateUserDto.tokenExpirationDate) user.tokenExpirationDate = updateUserDto.tokenExpirationDate;
    if (updateUserDto.lastLoginAt) user.lastLoginAt = updateUserDto.lastLoginAt;
    if (updateUserDto.failedLoginAttempts !== undefined) user.failedLoginAttempts = updateUserDto.failedLoginAttempts;
    if (updateUserDto.isAccountLocked !== undefined) user.isAccountLocked = updateUserDto.isAccountLocked;
    if (updateUserDto.isPasswordResetRequested !== undefined) user.isPasswordResetRequested = updateUserDto.isPasswordResetRequested;
    user.updatedAt = new Date();
    // Update roles
    user.roles = roles;

    // Save the updated user
    const saveUser = await this.userRepository.save(user);

    return plainToInstance(UserResponseDto, saveUser, { excludeExtraneousValues: true });
  }

  async inactive(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
  
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  
    // Set the isActive field to false
    user.isActive = false;
  
    // Save the updated user entity
    await this.userRepository.save(user);
  }
  
  async active(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
  
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  
    // Set the isActive field to false
    user.isActive = true;
  
    // Save the updated user entity
    await this.userRepository.save(user);
  }

}
