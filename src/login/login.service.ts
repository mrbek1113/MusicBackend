import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { loginDto } from './dto/create-login.dto';
import { compare } from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class LoginService {
  constructor(private prisma: PrismaService) {}

  async login(dto: loginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }
}
