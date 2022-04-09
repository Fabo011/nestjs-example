import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserCredentials {
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  username: string;

  @IsString()
  @MinLength(3)
  @MaxLength(15)
  firstname: string;

  @IsString()
  @MinLength(3)
  @MaxLength(15)
  lastname: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  email: string;

  @IsString()
  role: string;

  @IsString()
  @MinLength(8, { message: 'Password must have atleast 8 characters!' })
  @MaxLength(20, { message: 'Password is too long, make sure that you have not more then 20 characters!' })
  password: string;
}