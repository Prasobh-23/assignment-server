import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Db, ObjectId } from 'mongodb';
import { ResponseData } from 'src/resdata/res';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {

  private usersCollection;

  constructor(@Inject('DATABASE_CONNECTION') private readonly db: Db) {
    this.usersCollection = this.db.collection('users');
  }

  async create(createUserDto: CreateUserDto) {
    try {

      let count = await this.usersCollection.countDocuments({ strEmail: createUserDto.strEmail, strStatus: "N" });
      if (count == 0) {

        let pkUserId = new ObjectId();

        let user = {
          pkUserId: pkUserId,
          strUserName: createUserDto.strUserName,
          strEmail: createUserDto.strEmail,
          strPassword: createUserDto.strPassword,
          strStatus: "N",
          dateCreated: new Date(),
          dateUpdated: null,
          createdUser: pkUserId,
          updatedUser: null
        }

        const result = await this.usersCollection.insertOne(user);
        if (result) {
          return new ResponseData(true, 'Data created successfully', [result], HttpStatus.OK, 0);
        } else {
          return new ResponseData(false, 'Failed to create', [], HttpStatus.BAD_REQUEST, 0);
        }
      } else {
        return new ResponseData(false, 'E-mail already exists', [], HttpStatus.BAD_REQUEST, 0);
      }
    } catch (e) {
      console.error('Error occurred:', e);
      return new ResponseData(false, 'Internal server error', [], HttpStatus.INTERNAL_SERVER_ERROR, 0);
    }
  }

}
