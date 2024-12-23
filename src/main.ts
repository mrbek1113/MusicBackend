import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
// import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // Static papkani o'rnatish
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads', // '/uploads' URL orqali yuklangan fayllar bo'ladi
  });
  console.log('Static assets served from:', join(__dirname, '..', 'uploads'));
  app.enableCors();
  // Portni sozlash
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
