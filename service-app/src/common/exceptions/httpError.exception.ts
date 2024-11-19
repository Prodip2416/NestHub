import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    
    // Check if the error is a validation error
    if (exceptionResponse && Array.isArray(exceptionResponse['message'])) {
      // Format the validation errors
      const formattedErrors = this.formatValidationErrors(exceptionResponse['message']);
      response.status(status).json({
        statusCode: status,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    } else {
      response.status(status).json(exceptionResponse);
    }
  }

  // Format the validation errors as per your requirement
  private formatValidationErrors(errors: string[]): { field: string; errors: string[] }[] {
    const formattedErrors: { field: string; errors: string[] }[] = [];

    errors.forEach(error => {
      // Example: Split the message to extract the field name and error message
      const [field, message] = error.split(' ') || [];
      const existingField = formattedErrors.find(e => e.field === field);

      if (existingField) {
        existingField.errors.push(message);
      } else {
        formattedErrors.push({ field, errors: [message] });
      }
    });

    return formattedErrors;
  }
}
