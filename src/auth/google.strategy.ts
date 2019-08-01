import { UserRepository } from './user.repository';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
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
      clientSecret: google.clientSecret,
      callbackURL: '/auth/google/callback',
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      scope: ['profile']
    });
  }
  async validate(
    googleAccessToken: string,
    refreshToken: string,
    profile: any,
    cb
  ) {
    try {
      const signInDto: SignInDto = {
        username: profile.id,
        password: profile.id
      };

      let username = await this.userRepository.validateUser(signInDto);
      if (!username) {
        username = await this.authService.signUp(signInDto);
      }

      cb(null, username);
    } catch (err) {
      cb(err, null);
    }
  }
}
