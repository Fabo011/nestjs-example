import { Controller, Post, Res, ConflictException, Injectable, Body, ValidationPipe} from '@nestjs/common';
import { UserCredentials } from './users.credentials';
import { LoginCredentials } from './loginCredentials';
import {  Response } from 'express';
import { JwtService } from '@nestjs/jwt';

import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User } from '../schemas/users.schema';


@Injectable()
@Controller('auth')
export class UserController {
  constructor(@InjectModel('User') private userModel: Model<User>,
  private jwtService: JwtService
  ) {}

 

  @Post('/signup')
  async signUp(@Res() response: Response, @Body(ValidationPipe) userCredentials: UserCredentials): Promise<any> {
    
    const { username, firstname, lastname, email, password } = userCredentials;

    const Salt= 10
    const hash = await bcrypt.hash(password, Salt);
    
    const user = new this.userModel({ username, firstname, lastname, email, password: hash });

    try {
      await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User already registered');
      }
      throw error;
    };

    //jwt token
    const payload = { email: email };
    const token= this.jwtService.sign(payload);
   
    response.cookie('access_token', token, {
       httpOnly: true,
       expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    }).send({success: true});
     
  }; //signUp


////////////////////////////////////////////////////////////////////////////////////////////////////////////


  @Post('/login')
  async login(@Res() response: Response, @Body(ValidationPipe) loginCredentials: LoginCredentials): Promise<any> {
    const { email, password } = loginCredentials;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      console.log('No User');  
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log('Password not valid'); 
      return null;
    }

    //jwt token
    const payload = { email: email };
    const token= this.jwtService.sign(payload);
   
    response.cookie('access_token', token, {
       httpOnly: true,
       expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    }).send({success: true});

  }; //login

  /////////////////////////////////////////////////////////////////////////////////////////////////

  @Post('/logout')
  async logout(@Res() response: Response){
      response.clearCookie('access_token').send({success: true});
  };//logout
    

};



  
