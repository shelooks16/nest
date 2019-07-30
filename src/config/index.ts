import * as dotenv from 'dotenv';

dotenv.config();

export const server = {
  port: process.env.PORT || '3001'
};

export const google = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
};

export const jwt = {
  secret: process.env.JWT_SECRET || 'supaa secret',
  expiresIn: '5m'
};
