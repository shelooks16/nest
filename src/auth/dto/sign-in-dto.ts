import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

class SignInDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;
}

export { SignInDto };
