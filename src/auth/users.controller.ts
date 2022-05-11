//nest
import { Controller, Post, Res, Injectable, Body, ValidationPipe} from '@nestjs/common';
import { UserCredentials } from './users.credentials';
import { LoginCredentials } from './loginCredentials';
import {  Response } from 'express';

//auth Service
import { AuthService } from './users.service';


@Injectable()
@Controller('auth')
export class UserController {
  constructor(private authService: AuthService) {}

 
  @Post('/signup')
  async signUp(@Res() res: Response, @Body(ValidationPipe) userCredentials: UserCredentials): Promise<any> {
    const { username, firstname, lastname, email, password, role } = userCredentials;

    //auth service
    await this.authService.saveUserAtSignUp({ username, firstname, lastname, email, password, role });

    //jwt token store httpOnly to prevent XSS-Attacks
    const token = await this.authService.jwtSignUp({ username, role });
    res.cookie('access_token', token, { httpOnly: true }).send({success: true});
     
  }; //signUp End


////////////////////////////////////////////////////////////////////////////////////////////////////////////


  @Post('/login')
  async login(@Res() res: Response, @Body(ValidationPipe) loginCredentials: LoginCredentials): Promise<any> {
    const { username, password } = loginCredentials;

    //find User from database & check if password and user in valid
    const user = await this.authService.loginUser({ username, password });
    
    //jwt token store httpOnly to prevent XSS-Attacks
    const theRole= user.role;
    const token = await this.authService.jwtLogin({ username, theRole });
    res.cookie('access_token', token, { httpOnly: true }).send({success: true});
     
  }; //login End

  /////////////////////////////////////////////////////////////////////////////////////////////////

  @Post('/logout')
  async logout(@Res() response: Response): Promise<any> {
      response.clearCookie('access_token').send({success: true});
  };//logout End
    

};



  
