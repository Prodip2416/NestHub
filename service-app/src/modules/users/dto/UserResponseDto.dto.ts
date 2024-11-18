import { Expose, Type } from "class-transformer";

export class UserResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    @Type(() => RoleDto) // Transform nested roles
    roles: RoleDto[];

    @Expose()
    address: string;

    @Expose()
    phoneNumber: string;

    @Expose()
    isActive: boolean;

    @Expose()
    createdAt:Date

    @Expose()
    updatedAt:Date

  }
 
  export class RoleDto {
    @Expose()
    id: number;
  
    @Expose()
    name: string;
  }