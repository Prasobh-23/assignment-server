import { Controller, Post, Get, Body, Query, Res, HttpStatus, HttpException, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

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

  @Post('loginUser')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response): Promise<void> {
    try {
      const responseData = await this.AuthService.login(loginUserDto);
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

  @Get('googleLogin')
  @UseGuards(AuthGuard('google'))
  async googleLogin() { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    try {
      const responseData = req.user;
      // res.redirect(`http://localhost:3000/someFrontendRoute?token=${responseData.data[0].token}`);
      res.json(responseData);
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
