import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit conversion for numbers
        // This will allow automatic conversion of string to number
      },
    }),
  );

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS - Blog app API')
    .setDescription('NestJS API description')
    .setTermsOfService('http://localhost:3000/terms')
    .setLicense('MIT License', 'http://localhost:3000/license')
    .addServer('http://localhost:3000', 'Local server')
    .setVersion('1.0')
    .build();
  // Create the Swagger document
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  // Setup the AWS SDK used uploading the files to S3 bucket
  const configService = app.get(ConfigService); // Import from @nestjs/config
  config.update({
    credentials: {
      accessKeyId:
        configService.get('appConfig.awsAccessKeyId') ?? 'Key Not Found',
      secretAccessKey:
        configService.get('appConfig.awsSecretAccessKey') ?? 'Key Not Found',
    },
    region: configService.get('appConfig.awsRegion'),
  });

  // Enable CORS
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});
