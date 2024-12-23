import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from './register.service';
import { Prisma } from '@prisma/client';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async register(@Body() dto: Prisma.UserCreateInput) {
    return this.registerService.register(dto);
  }
}
