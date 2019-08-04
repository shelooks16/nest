import { github } from './../config/index';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in-dto';
import axios from 'axios';

@Injectable()
export class GithubAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { code } = request.query;
    if (!code) {
      return false;
    }

    try {
      const loginResp = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: github.clientId,
          client_secret: github.clientSecret,
          code
        }
      );

      const accessToken = loginResp.data.split('access_token=')[1].slice(0, 40);

      const apiResp = await axios.get(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${accessToken}`
        }
      });

      const signInDto: SignInDto = {
        username: apiResp.data.login,
        password: apiResp.data.id.toString()
      };

      let username: string = await this.userRepository.validateUser(signInDto);
      if (!username) {
        username = await this.authService.signUp(signInDto);
      }
      request.user = {
        username
      };
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }

    return true;
  }
}
