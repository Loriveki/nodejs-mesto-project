import { config } from 'dotenv';

config();

interface AppConfig {
  mongoUri: string;
  port: string;
  jwtSecret: string;
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const appConfig: AppConfig = {
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mestodb',
  port: process.env.PORT || '3000',
  jwtSecret: process.env.JWT_SECRET,
};

export default appConfig;
