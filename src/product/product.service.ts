import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Music } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Yangi musiqani yaratish
   * @param data - Musiqa ma'lumotlari
   * @returns Yaratilgan musiqa obyekti
   */
  async create(data: any): Promise<Music> {
    try {
      // Ma'lumotlar validatsiyasi uchun oddiy tekshiruv
      if (!data.name || !data.image || !data.file) {
        throw new HttpException(
          'Name, image va file maydonlari to‘ldirilishi kerak',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Prisma orqali musiqa yozuvini yaratish
      return await this.prisma.music.create({ data });
    } catch (error) {
      throw new HttpException(
        error.message || 'Musiqa yaratishda xatolik yuz berdi',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Barcha musiqalarni olish
   * @returns Musiqa yozuvlari ro'yxati
   */
  async findAll(): Promise<Music[]> {
    try {
      const musicList = await this.prisma.music.findMany();

      return musicList;
    } catch (error) {
      throw new HttpException(
        error.message || 'Musiqalarni olishda xatolik yuz berdi',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
