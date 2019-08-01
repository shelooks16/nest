import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards,
  Res
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
  signIn(@GetUser() username: string): Promise<{ accessToken: string }> {
    return this.authService.signIn(username);
  }

  @UseGuards(AuthGuard('google'))
  @Get('/google')
  // tslint:disable-next-line
  signInGoogle() {}

  @UseGuards(AuthGuard('google'))
  @Get('/google/callback')
  async signInGoogleCallback(@GetUser() username: string, @Res() res) {
    // TODO: figure out how to send back to the client
    const { accessToken } = await this.authService.signIn(username);
    // console.log(accessToken);
    res.redirect('/');
  }
}
