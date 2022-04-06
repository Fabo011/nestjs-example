import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  @Get()
  @Render('Home')
  root()  {
    return {message: 'hello'};
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @Render('Profile')
  getProfile()  {
    return {message: 'User is Online'};
  }
}
