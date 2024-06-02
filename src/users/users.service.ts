import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Db, ObjectId } from 'mongodb';

@Injectable()
export class UsersService {

  private usersCollection;

  constructor(@Inject('DATABASE_CONNECTION') private readonly db: Db) {
    this.usersCollection = this.db.collection('users');
  }

  async create(createUserDto: CreateUserDto) {

    let pkUserId = new ObjectId();

    let user = {
      pkUserId: pkUserId,
      strUserName: createUserDto.strUserName,
      strEmail: createUserDto.strEmail,
      strStatus: "N",
      dateCreated: new Date(),
      dateUpdated: null,
      createdUser: pkUserId,
      updatedUser: null
    }

    const result = await this.usersCollection.insertOne(user);
    return result;
  }

  async findAll() {
    const result = await this.usersCollection.find().toArray();
    return result;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
