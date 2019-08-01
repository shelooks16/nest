import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/sign-up-dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  signUp(signUpDto: SignUpDto): Promise<string> {
    return this.userRepository.signUp(signUpDto);
  }

  async signIn(username: string): Promise<{ accessToken: string }> {
    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
