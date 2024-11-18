import { IsArray, IsNumber, IsString } from "class-validator";

export class RoleDTO {
    @IsString()
    name: string;
  
    @IsArray()
    @IsNumber({}, { each: true })
    permissions: number[];  // Now an array of permission IDs
  
  }