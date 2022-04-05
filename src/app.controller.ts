import { Controller, Get, Render, Request } from '@nestjs/common';
//import { AppService } from './app.service';

@Controller()
export class AppController {
  //constructor(private readonly appService: AppService) {}

  @Get()
  @Render('Home')
  root()  {
    return {message: 'hello'};
  }


  @Get('profile')
  @Render('Profile')
  getProfile(@Request() req)  {
    return req.user;
  }
}
