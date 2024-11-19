import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../enum/RolesEnum.enum';

export const Roles = (...roles: RolesEnum[]) => SetMetadata('roles', roles);
