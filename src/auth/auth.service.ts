import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Db, ObjectId } from 'mongodb';
import { ResponseData } from 'src/resdata/res';
import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

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

        let ecnPass = await encrypt(createUserDto.strPassword);

        let user = {
          pkUserId: pkUserId,
          strUserName: createUserDto.strUserName,
          strEmail: createUserDto.strEmail,
          strPassword: ecnPass,
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

  async login(loginUserDto: LoginUserDto) {
    try {

      let isUserExist = await this.usersCollection.find({ strEmail: loginUserDto.strEmail, strStatus: "N" }).toArray();
      if (isUserExist.length == 1) {

        let comapre = await compare(isUserExist[0].strPassword, loginUserDto.strPassword);
        if (comapre) {

          let result = isUserExist;

          return new ResponseData(true, 'Data verified successfully', [result], HttpStatus.OK, 0);
        } else {
          return new ResponseData(false, 'Failed to verify. Incorrect password', [], HttpStatus.BAD_REQUEST, 0);
        }
      } else {
        return new ResponseData(false, 'Account with this E-mail does not exists', [], HttpStatus.BAD_REQUEST, 0);
      }
    } catch (e) {
      console.error('Error occurred:', e);
      return new ResponseData(false, 'Internal server error', [], HttpStatus.INTERNAL_SERVER_ERROR, 0);
    }
  }

}

async function encrypt(strPassword: string): Promise<string> {
  try {

    const saltRounds = 10; // Number of salt rounds
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(strPassword, salt);

    return hashedPassword;
  } catch (e) {
    console.error('Error occurred:', e);
    throw e;
  }
}

async function compare(strPassword: string, hashedPassword: string): Promise<boolean> {
  try {

    const auth = await bcrypt.compare(hashedPassword, strPassword);

    return auth;
  } catch (e) {
    console.error('Error occurred:', e);
    throw e;
  }
}