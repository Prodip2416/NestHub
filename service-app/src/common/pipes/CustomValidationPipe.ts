import { ValidationPipe, BadRequestException } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors = []) => {
      const errors = validationErrors.map(err => ({
        field: err.property,
        errors: Object.values(err.constraints || {}),
      }));
      return new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors,
      });
    };
  }
}
