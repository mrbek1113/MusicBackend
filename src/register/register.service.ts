import { Injectable, BadRequestException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from './dto/create-register.dto';

@Injectable()
export class RegisterService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });
    if (findUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hash(dto.password, 10);
    const user = this.prisma.user.create({
      data: {
        name: dto.name,
        username: dto.username,
        password: hashedPassword,
      },
    });
    return user;
  }
}
