import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in-dto';
import { google } from '../config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
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
      const userProfile: SignInDto = {
        username: profile.id,
        password: profile.id
      };

      const {
        accessToken
      }: { accessToken: string } = await this.authService.signInWithOAuth(
        userProfile
      );

      const user = { accessToken };

      cb(null, user);
    } catch (err) {
      cb(err, null);
    }
  }
}
