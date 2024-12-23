import { existsSync, mkdirSync } from 'fs';
import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ProductService } from './product.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'file', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const uploadPath = './uploads'; // Papka joylashuvi
            if (!existsSync(uploadPath)) {
              mkdirSync(uploadPath, { recursive: true }); // Agar papka yo'q bo'lsa, uni yaratish
            }
            cb(null, uploadPath); // Faylni yuklash joyi
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; file?: Express.Multer.File[] },
    @Req() req: Request, // `req` obyektini olish
  ) {
    try {
      // Fayl yo'llarini to'g'ri shakllantirish
      if (files?.image?.length > 0) {
        createProductDto.image = `${req.protocol}://${req.get('host')}/uploads/${files.image[0].filename}`;
      } else {
        throw new HttpException(
          'Image file is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (files?.file?.length > 0) {
        createProductDto.file = `${req.protocol}://${req.get('host')}/uploads/${files.file[0].filename}`;
      } else {
        throw new HttpException(
          'Audio file is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Ma'lumotlarni saqlash
      return await this.productService.create(createProductDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    const product = await this.productService.findAll();
    if (!product || product.length === 0) {
      throw new HttpException('Products not found', HttpStatus.NOT_FOUND);
    }
    return product.map((item) => ({
      ...item,
      image: `${process.env.BASE_URL || 'http://localhost:3000'}/${item.image}`,
      file: `${process.env.BASE_URL || 'http://localhost:3000'}/${item.file}`,
    }));
  }
}
