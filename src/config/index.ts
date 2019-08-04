import * as dotenv from 'dotenv';

dotenv.config();

export const server: { port: string | number } = {
  port: process.env.PORT || '3001'
};

export const google: { clientId: string; clientSecret: string } = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
};

export const jwt: { secret: string; expiresIn: string } = {
  secret: process.env.JWT_SECRET || 'supaa secret',
  expiresIn: '5m'
};

export const github: { clientId: string; clientSecret: string } = {
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET
};
