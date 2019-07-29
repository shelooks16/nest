import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpDto } from './dto/sign-up-dto';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ErrorCodes } from './types/error-codes-enum';
import { SignInDto } from './dto/sign-in-dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { username, password } = signUpDto;

    let newUser;

    try {
      newUser = await this.save({
        username,
        password: await bcrypt.hash(password, 10)
      });
    } catch (error) {
      if (error.code === ErrorCodes.duplicate) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return newUser;
  }

  async validateUser(signInDto: SignInDto): Promise<string> {
    const { username, password } = signInDto;

    const user = await this.findOne({ username });
    if (user && (await user.isPasswordMatches(password))) {
      return username;
    } else {
      return null;
    }
  }
}
