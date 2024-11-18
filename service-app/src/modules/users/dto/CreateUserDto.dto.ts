import { IsString, IsEmail, IsOptional, IsBoolean, IsInt, IsDate, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 300)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 255)
  password: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsDate()
  tokenExpirationDate?: Date;

  @IsOptional()
  @IsDate()
  lastLoginAt?: Date;

  @IsOptional()
  @IsInt()
  failedLoginAttempts?: number;

  @IsOptional()
  @IsBoolean()
  isAccountLocked?: boolean;

  @IsOptional()
  @IsBoolean()
  isPasswordResetRequested?: boolean;

  @IsOptional()
  roles?: number[]; // Array of role IDs
}
