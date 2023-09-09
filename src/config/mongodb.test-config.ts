import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => ({
  host: process.env.MONGODB_HOST || '127.0.0.1',
  port: parseInt(process.env.MONGODB_PORT, 10) || 27017,
  database: process.env.MONGODB_DATABASE_TEST || 'chatapp_test',
}));
