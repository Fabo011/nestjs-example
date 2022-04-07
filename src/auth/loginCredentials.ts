import { IsString} from 'class-validator';

export class LoginCredentials {
  @IsString()
  username: string;

  @IsString()
  password: string;
}