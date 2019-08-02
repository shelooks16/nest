import { UserRepository } from './user.repository';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in-dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {
    super();
  }

  async validate(
    username: string,
    password: string
  ): Promise<{ username: string }> {
    const signInDto: SignInDto = { username, password };
    const validUsername: string = await this.userRepository.validateUser(
      signInDto
    );
    if (!validUsername) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      username: validUsername
    };
  }
}
