import { Body, Controller, Post, ValidationPipe, Request} from '@nestjs/common';
import { UserService } from './users.service';
import { UserCredentials } from './users.credentials';



@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) userCredentials: UserCredentials
  ): Promise<any> {
    return await this.userService.signUp(userCredentials);
  }

 
  @Post('login')
  async signIn(@Request() req) {
    return this.userService.signIn(req.user);
  }

}