import { createParamDecorator } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator((data, req): User | string => {
  return data ? req.user && req.user[data] : req.user;
});
