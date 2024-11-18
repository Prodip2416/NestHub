import { IsString } from "class-validator";

export class CreatePermissionDTO {
    @IsString()
    name: string;
  
  }