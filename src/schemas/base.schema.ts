import mongoose from 'mongoose';

export class Base {
  // Auto-generated fields
  _id: mongoose.Schema.Types.ObjectId;
  __v: number;
}

export class BaseWithTimestamps extends Base {
  // Auto-generated fields when set timestamps to true
  createdAt: Date;
  updatedAt: Date;
}
