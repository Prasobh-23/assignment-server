import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { GetBlogDto } from './dto/get-blog.dto';
import { Db, ObjectId } from 'mongodb';
import { ResponseData } from 'src/resdata/res';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class BlogsService {

    private blogsCollection;

    constructor(@Inject('DATABASE_CONNECTION') private readonly db: Db) {
        this.blogsCollection = this.db.collection('blogs');
    }

    async create(CreateBlogDto: CreateBlogDto): Promise<ResponseData<any>> {
        try {

            let pkBlogId = new ObjectId();
            let fkUserId = new ObjectId(CreateBlogDto.fkUserId);

            let blog = {
                pkBlogId: pkBlogId,
                strBlogTitle: CreateBlogDto.strBlogTitle,
                strBlogContent: CreateBlogDto.strBlogContent,
                fkUserId: fkUserId,
                strStatus: "N",
                dateCreated: new Date(),
                dateUpdated: null,
                createdUser: fkUserId,
                updatedUser: null
            }

            const result = await this.blogsCollection.insertOne(blog);
            if (result) {
                return new ResponseData(true, 'Data created successfully', [result], HttpStatus.OK, 0);
            } else {
                return new ResponseData(false, 'Failed to create', [], HttpStatus.BAD_REQUEST, 0);
            }
        } catch (e) {
            console.error('Error occurred:', e);
            return new ResponseData(false, 'Internal server error', [], HttpStatus.INTERNAL_SERVER_ERROR, 0);
        }
    }

    async findAll(GetBlogDto: GetBlogDto): Promise<ResponseData<any>> {
        try {

            let fkUserId = new ObjectId(GetBlogDto.fkUserId);

            let match = {
                fkUserId: fkUserId,
                strStatus: "N"
            }

            let count = await this.blogsCollection.countDocuments(match);
            if (count > 0) {

                let intSkipCount = parseInt(GetBlogDto.intSkipCount) || 0;
                let intPageLimit = parseInt(GetBlogDto.intPageLimit) || count;

                let project = {
                    _id: 0,
                }

                let result = await this.blogsCollection.aggregate([
                    { $match: match },
                    { $project: project },
                    { $sort: { dateCreated: -1 } },
                    { $skip: intSkipCount },
                    { $limit: intPageLimit }
                ]).toArray();
                return new ResponseData(true, 'Data fetched successfully', result, HttpStatus.OK, count);
            } else {
                return new ResponseData(true, 'No data found', [], HttpStatus.NOT_FOUND, count);
            }
        } catch (e) {
            console.error('Error occurred:', e);
            return new ResponseData(false, 'Internal server error', [], HttpStatus.INTERNAL_SERVER_ERROR, 0);
        }
    }

    async findOne(GetBlogDto: GetBlogDto): Promise<ResponseData<any>> {
        try {

            let pkBlogId = new ObjectId(GetBlogDto.pkBlogId);
            let fkUserId = new ObjectId(GetBlogDto.fkUserId);

            let match = {
                fkUserId: fkUserId,
                pkBlogId: pkBlogId,
                strStatus: "N"
            }

            let count = await this.blogsCollection.countDocuments(match);
            if (count > 0) {

                let project = {
                    _id: 0,
                }

                let result = await this.blogsCollection.aggregate([
                    { $match: match },
                    { $project: project }
                ]).toArray();
                return new ResponseData(true, 'Data fetched successfully', result, HttpStatus.OK, count);
            } else {
                return new ResponseData(true, 'No data found', [], HttpStatus.NOT_FOUND, count);
            }
        } catch (e) {
            console.error('Error occurred:', e);
            return new ResponseData(false, 'Internal server error', [], HttpStatus.INTERNAL_SERVER_ERROR, 0);
        }
    }

    async update(UpdateBlogDto: UpdateBlogDto): Promise<ResponseData<any>> {
        try {

            if (UpdateBlogDto.pkBlogId) {

                let pkBlogId = new ObjectId(UpdateBlogDto.pkBlogId);
                let fkUserId = new ObjectId(UpdateBlogDto.fkUserId);

                let match = {
                    pkBlogId: pkBlogId,
                    strStatus: "N"
                }

                let count = await this.blogsCollection.countDocuments(match);
                if (count > 0) {

                    let blog = {
                        strBlogTitle: UpdateBlogDto.strBlogTitle,
                        strBlogContent: UpdateBlogDto.strBlogContent,
                        dateUpdated: new Date(),
                        updatedUser: fkUserId
                    }

                    const result = await this.blogsCollection.updateOne(match, { $set: blog });
                    if (result.modifiedCount == 1) {
                        return new ResponseData(true, 'Data updated successfully', [result], HttpStatus.OK, 0);
                    } else {
                        return new ResponseData(false, 'Failed to update', [], HttpStatus.BAD_REQUEST, 0);
                    }
                } else {
                    return new ResponseData(true, 'No data found', [], HttpStatus.NOT_FOUND, count);
                }
            } else {
                return new ResponseData(false, 'Blog Id missing', [], HttpStatus.BAD_REQUEST, 0);
            }
        } catch (e) {
            console.error('Error occurred:', e);
            return new ResponseData(false, 'Internal server error', [], HttpStatus.INTERNAL_SERVER_ERROR, 0);
        }
    }

    async delete(UpdateBlogDto: UpdateBlogDto): Promise<ResponseData<any>> {
        try {

            if (UpdateBlogDto.pkBlogId) {

                let pkBlogId = new ObjectId(UpdateBlogDto.pkBlogId);
                let fkUserId = new ObjectId(UpdateBlogDto.fkUserId);

                let match = {
                    pkBlogId: pkBlogId,
                    strStatus: "N"
                }

                let count = await this.blogsCollection.countDocuments(match);
                if (count > 0) {

                    let blog = {
                        strStatus: "D",
                        dateUpdated: new Date(),
                        updatedUser: fkUserId
                    }

                    const result = await this.blogsCollection.updateOne(match, { $set: blog });
                    if (result.modifiedCount == 1) {
                        return new ResponseData(true, 'Data deleted successfully', [result], HttpStatus.OK, 0);
                    } else {
                        return new ResponseData(false, 'Failed to delete', [], HttpStatus.BAD_REQUEST, 0);
                    }
                } else {
                    return new ResponseData(true, 'No data found', [], HttpStatus.NOT_FOUND, count);
                }
            } else {
                return new ResponseData(false, 'Blog Id missing', [], HttpStatus.BAD_REQUEST, 0);
            }
        } catch (e) {
            console.error('Error occurred:', e);
            return new ResponseData(false, 'Internal server error', [], HttpStatus.INTERNAL_SERVER_ERROR, 0);
        }
    }

}
