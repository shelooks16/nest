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
import { SignInDto } from './dto/sign-in-dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user-decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) signUpDto: SignUpDto): Promise<string> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) signInDto: SignInDto
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInDto);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  // tslint:disable-next-line
  signInGoogle() {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async signInGoogleCallback(@GetUser() user, @Res() res) {
    const { accessToken } = user;
    res.redirect('/');
  }

  @Get('/google/success')
  signInSuccess() {
    return { msg: 'Success' };
  }
}
