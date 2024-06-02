import { Controller, Post, Get, Body, Query, Res, HttpStatus, HttpException, Patch, Delete } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class AuthController {
  constructor(private readonly AuthService: AuthService) { }

  @Post('registerUser')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response): Promise<void> {
    try {
      const responseData = await this.AuthService.create(createUserDto);
      res.status(responseData.status).json(responseData);
    } catch (error) {
      if (error instanceof HttpException) {
        const status = error.getStatus();
        const response = error.getResponse();
        res.status(status).json(response);
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Internal server error',
          data: [],
          status: HttpStatus.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

}
