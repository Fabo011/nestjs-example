import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './users.controller';
//import { UserService } from './users.service';
import { UserSchema } from '../schemas/users.schema';
import { AuthStrategy } from './auth.strategy';
//import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
//const token:string= process.env.JWTTOKEN;
@Module({
  controllers: [UserController],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),

    //PassportModule,
    JwtModule.register({
      secret: process.env.JWTTOKEN,
      signOptions: { expiresIn: '24h' },
    }),

  ],
  //controllers: [UserController],
  providers: [AuthStrategy],
})
export class UserModule {}