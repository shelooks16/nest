import { GithubAuthGuard } from './github-auth.guard';
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up-dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user-decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) signUpDto: SignUpDto): Promise<string> {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  signIn(
    @GetUser('username') username: string
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(username);
  }

  @UseGuards(AuthGuard('google'))
  @Get('/google')
  signInGoogle(
    @GetUser('username') username: string
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(username);
  }

  @UseGuards(GithubAuthGuard)
  @Get('/github')
  signInGithub(
    @GetUser('username') username: string
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(username);
  }
}
