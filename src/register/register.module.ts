import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService],
  imports: [PrismaModule],
})
export class RegisterModule {}
