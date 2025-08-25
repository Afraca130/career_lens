import { MongooseModuleOptions } from '@nestjs/mongoose';

export const databaseConfig: MongooseModuleOptions = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mountain',
  connectionFactory: (connection) => {
    connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });
    connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    return connection;
  },
};