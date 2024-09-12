import { ObjectId } from 'mongoose';

export class UserDto {
  id: ObjectId;
  name: string;
  email: string;
}