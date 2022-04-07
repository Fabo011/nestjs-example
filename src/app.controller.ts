import { Controller, Get, Render, UseGuards, Param, Res, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Model } from 'mongoose';
import { User } from './schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(@InjectModel('User') private userModel: Model<User>,
  ) {}

  @Get()
  @Render('Home')
  root()  {
    return {message: 'hello'};
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile/:username')
  @Render('Profile')
  async getProfile(@Param('username') username, @Res() res: Response)  {

    const user= await this.userModel.findOne({ username: username });
      if(!user){
        console.log('No User');
        return res.status(HttpStatus.BAD_REQUEST).send('Fail');
       };
     const img= user.image;
    return { username, img };
  }
}
