import { Controller, Post, Get, Body, Query, Res, HttpStatus, HttpException, Patch, Delete } from '@nestjs/common';
import { Response } from 'express';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { GetBlogDto } from './dto/get-blog.dto';
import { ResponseData } from '../resdata/res';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogsService: BlogsService) { }

    @Post('createBlog')
    async create(@Body() createBlogDto: CreateBlogDto, @Res() res: Response): Promise<void> {
        try {
            const responseData = await this.blogsService.create(createBlogDto);
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

    @Get('getAllBlogs')
    async findAll(@Query() getBlogDto: GetBlogDto, @Res() res: Response): Promise<void> {
        try {
            const responseData = await this.blogsService.findAll(getBlogDto);
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

    @Get('getOneBlog')
    async findOne(@Query() getBlogDto: GetBlogDto, @Res() res: Response): Promise<void> {
        try {
            const responseData = await this.blogsService.findOne(getBlogDto);
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

    @Patch('updateBlog')
    async update(@Body() updateBlogDto: UpdateBlogDto, @Res() res: Response): Promise<void> {
        try {
            const responseData = await this.blogsService.update(updateBlogDto);
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

    @Post('deleteBlog')
    async delete(@Body() updateBlogDto: UpdateBlogDto, @Res() res: Response): Promise<void> {
        try {
            const responseData = await this.blogsService.delete(updateBlogDto);
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
