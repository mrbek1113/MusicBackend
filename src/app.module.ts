import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { AppController } from './app.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AppService } from './app.service';
import { RegisterController } from './register/register.controller';
import { LoginController } from './login/login.controller';
import { RegisterService } from './register/register.service';
import { LoginService } from './login/login.service';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    PrismaModule,
    RegisterModule,
    LoginModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // uploads papkasini root qilib belgilang
      serveRoot: '/uploads', // Bu orqali siz upload papkasiga to'g'ridan-to'g'ri kirishingiz mumkin
    }),
  ],
  controllers: [
    ProductController,
    AppController,
    RegisterController,
    LoginController,
  ],
  providers: [ProductService, AppService, RegisterService, LoginService], // AppService provider sifatida kiritiladi
})
export class AppModule {}
