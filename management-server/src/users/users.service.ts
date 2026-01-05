import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      username,
      password: hashedPassword,
    });
    return await newUser.save();
  }

  async findByUsername(username: string) {
    return await this.userModel
      .findOne({ username })
      .select('+password')
      .exec();
  }

  async findById(userId: string) {
    return await this.userModel.findById(userId).exec();
  }
}
