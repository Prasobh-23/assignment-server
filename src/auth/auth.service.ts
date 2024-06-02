import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Db, ObjectId } from 'mongodb';
import { ResponseData } from 'src/resdata/res';
import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as EmailValidator from 'email-validator';


@Injectable()
export class AuthService {

  private usersCollection;

  constructor(@Inject('DATABASE_CONNECTION') private readonly db: Db,
    private readonly configService: ConfigService,
  ) { this.usersCollection = this.db.collection('users'); }

  async create(createUserDto: CreateUserDto) {
    try {

      if (EmailValidator.validate(createUserDto.strEmail)) {
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

            let result = {
              pkUserId: user.pkUserId,
              strUserName: user.strUserName,
              strEmail: user.strEmail,
            }

            let token = await this.jwtSign(pkUserId.toString());
            (result as any).token = token;

            return new ResponseData(true, 'Data created successfully', [result], HttpStatus.OK, 0);
          } else {
            return new ResponseData(false, 'Failed to create', [], HttpStatus.BAD_REQUEST, 0);
          }
        } else {
          return new ResponseData(false, 'E-mail already exists', [], HttpStatus.BAD_REQUEST, 0);
        }
      } else {
        return new ResponseData(false, 'Invalid E-mail. Please try with another E-mail', [], HttpStatus.BAD_REQUEST, 0);
      }
    } catch (e) {
      console.error('Error occurred:', e);
      return new ResponseData(false, 'Internal server error', [], HttpStatus.INTERNAL_SERVER_ERROR, 0);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {

      if (EmailValidator.validate(loginUserDto.strEmail)) {
        let isUserExist = await this.usersCollection.find({ strEmail: loginUserDto.strEmail, strStatus: "N" }).toArray();
        if (isUserExist.length == 1) {

          let comapre = await compare(isUserExist[0].strPassword, loginUserDto.strPassword);
          if (comapre) {

            let result = {
              pkUserId: isUserExist[0].pkUserId,
              strUserName: isUserExist[0].strUserName,
              strEmail: isUserExist[0].strEmail,
            }

            let token = await this.jwtSign(isUserExist[0].pkUserId.toString());
            (result as any).token = token;

            return new ResponseData(true, 'Data verified successfully', [result], HttpStatus.OK, 0);
          } else {
            return new ResponseData(false, 'Failed to verify. Incorrect password', [], HttpStatus.BAD_REQUEST, 0);
          }
        } else {
          return new ResponseData(false, 'Account with this E-mail does not exists', [], HttpStatus.BAD_REQUEST, 0);
        }
      } else {
        return new ResponseData(false, 'Invalid E-mail. Please try with another E-mail', [], HttpStatus.BAD_REQUEST, 0);
      }
    } catch (e) {
      console.error('Error occurred:', e);
      return new ResponseData(false, 'Internal server error', [], HttpStatus.INTERNAL_SERVER_ERROR, 0);
    }
  }

  async googleLogin(profile) {
    try {

      const existingUser = await this.usersCollection.findOne({
        strEmail: profile.emails[0].value,
      });

      if (existingUser) {
        const responseData = await this.createResponseData(existingUser);
        return responseData;
      } else {
        const newUser = {
          pkUserId: new ObjectId(),
          strUserName: profile.displayName,
          strEmail: profile.emails[0].value,
          strPassword: '',
          strStatus: 'N',
          dateCreated: new Date(),
          dateUpdated: null,
          createdUser: null,
          updatedUser: null,
        };

        const result = await this.usersCollection.insertOne(newUser);

        if (result.insertedCount === 1) {
          const responseData = await this.createResponseData(newUser);
          return responseData;
        } else {
          return new ResponseData(
            false,
            'Failed to create user',
            [],
            HttpStatus.BAD_REQUEST,
            0,
          );
        }
      }
    } catch (error) {
      console.error('Error occurred:', error);
      return new ResponseData(
        false,
        'Internal server error',
        [],
        HttpStatus.INTERNAL_SERVER_ERROR,
        0,
      );
    }
  }

  private async createResponseData(user): Promise<ResponseData<any>> {
    // Create JWT token
    const token = await this.jwtSign(user.pkUserId.toString());
    const responseData = {
      pkUserId: user.pkUserId,
      strUserName: user.strUserName,
      strEmail: user.strEmail,
      token: token,
    };
    return new ResponseData(
      true,
      'Data retrieved successfully',
      [responseData],
      HttpStatus.OK,
      1,
    );
  }

  // create json web token
  private async jwtSign(pkUserId: string): Promise<string> {
    try {

      const maxAge = 3 * 24 * 60 * 60; //3days in seconds
      return jwt.sign({ pkUserId }, this.configService.get<string>('JWT_SECRET'), {
        expiresIn: maxAge
      });

    } catch (e) {
      console.error('Error occurred:', e);
      throw e;
    }
  }

}

/////////// auth helper functions///////////////////

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