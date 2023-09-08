export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mongodb: {
    host: process.env.MONGODB_HOST || '127.0.0.1',
    port: parseInt(process.env.MONGODB_PORT, 10) || 27017,
    database: process.env.MONGODB_DATABASE || 'chat-app',
  },
});
