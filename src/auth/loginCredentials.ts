import { IsString} from 'class-validator';

export class LoginCredentials {
  @IsString()
  email: string;

  @IsString()
  password: string;
}