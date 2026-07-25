// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation globale des DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Activer CORS pour autoriser le front-end ou Socket.IO
  app.enableCors();

  // --- Configuration Swagger ---
  const config = new DocumentBuilder()
    .setTitle('API Auth & WebSockets')
    .setDescription("Documentation de l'API d'authentification et de communication temps réel via WebSockets")
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Saisissez votre token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // L'URL Swagger sera : http://localhost:3000/api/docs

  await app.listen(3000);
  console.log(`🚀 Application lancée sur : http://localhost:3000`);
  console.log(`📚 Swagger dispo sur : http://localhost:3000/api/docs`);
}
bootstrap();