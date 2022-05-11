import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './users.controller';
import { UserSchema } from '../schemas/users.schema';
import { AuthStrategy } from './auth.strategy';
import { AuthService } from './users.service';

import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';

@Module({
  controllers: [UserController],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),

    JwtModule.register({
      secret: process.env.JWTTOKEN,
      signOptions: { expiresIn: '24h' },
    }),

  ],
  providers: [AuthStrategy, AuthService],
  exports: [AuthService],
})
export class UserModule {}