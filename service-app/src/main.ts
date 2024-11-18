import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomValidationPipe } from './common/pipes/CustomValidationPipe';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { MyLogger } from './common/middlewares/Logger.middleware';
import { GlobalExceptionFilter } from './common/filters/GlobalException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // Remove properties not defined in the DTO
  //     forbidNonWhitelisted: true, // Throw error if any property is not in the DTO
  //     transform: true, // Automatically transform payloads to match DTO types
  //   }),
  // );
  // Handle global response interceptor
  app.useGlobalPipes(new CustomValidationPipe());
  // Apply global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());
  // Apply middleware globally
  // app.use(new MyLogger().use);
 // Apply the filter globally
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.APP_RUNNING_PORT);
  console.log(`Nest.js app is running on port ${process.env.APP_RUNNING_PORT}`);
}
bootstrap();
