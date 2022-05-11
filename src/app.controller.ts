import { Controller, Get, Render, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
//service
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  @Render('Home')
  root()  {
    return {message: 'hello'};
  };

  @UseGuards(AuthGuard('jwt'))
  @Get('profile/:username')
  @Render('Profile')
  async getProfile(@Param('username') username)  {

   const theUser: string= username;
   const user=  await this.appService.findOne({theUser});
   const img= user.image;
   return { username, img };
   
  };

};
