import { ValidationPipe, BadRequestException } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors = []) => {
      // console.log({validationErrors})
      const errors = validationErrors.map(err => ({
        field: err.property,
        errors: Object.values(err.constraints || {}),
      }));
      // const filterOnlyeErros = errors.map((er)=>er?.errors);
      // console.log({errors})
      return new BadRequestException({
        statusCode: 400,
        message: 'Validation failed!',
        errors: errors.map((er)=>er?.errors).flat()
      });
    };
  }
}
