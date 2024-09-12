import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOneById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return user;
  }
}
