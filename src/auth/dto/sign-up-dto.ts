import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-zA-Z]).*$/, {
    message: 'Password is too weak'
  })
  password: string;
}
