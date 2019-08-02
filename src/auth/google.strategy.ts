import { UserRepository } from './user.repository';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-token';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in-dto';
import { google } from '../config';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {
    super({
      clientID: google.clientId,
      clientSecret: google.clientSecret
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any, cb) {
    try {
      const signInDto: SignInDto = {
        username: profile.displayName,
        password: profile.id
      };

      let username: string = await this.userRepository.validateUser(signInDto);
      if (!username) {
        username = await this.authService.signUp(signInDto);
      }

      const user = {
        username
      };

      cb(null, user);
    } catch (err) {
      cb(err, null);
    }
  }
}
