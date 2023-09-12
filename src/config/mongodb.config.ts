import { registerAs } from '@nestjs/config';

const alias = 'mongodb';
const baseConfig = {
  host: process.env.MONGODB_HOST || '127.0.0.1',
  port: parseInt(process.env.MONGODB_PORT, 10) || 27017,
  user: process.env.MONGODB_USER,
  password: process.env.MONGODB_PASSWORD,
};

export const mongodbConfig = registerAs(alias, () => ({
  ...baseConfig,
  database: process.env.MONGODB_DATABASE || 'chatapp',
}));

export const mongodbTestConfig = registerAs(alias, () => ({
  ...baseConfig,
  database: process.env.MONGODB_DATABASE_TEST || 'chatapp_test',
}));
