import { github } from './../config/index';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpService
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in-dto';

@Injectable()
export class GithubAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { code } = request.query;
    if (!code) {
      return false;
    }

    try {
      const accessTokenResp = await this.httpService
        .post('https://github.com/login/oauth/access_token', {
          client_id: github.clientId,
          client_secret: github.clientSecret,
          code
        })
        .toPromise();

      const accessToken: string = accessTokenResp.data
        .split('access_token=')[1]
        .slice(0, 40);

      const apiResp = await this.httpService
        .get(`https://api.github.com/user`, {
          headers: {
            Authorization: `token ${accessToken}`
          }
        })
        .toPromise();

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
