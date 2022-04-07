import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from './file.controller';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schemas/users.schema';
import { JwtModule } from '@nestjs/jwt';

const maxSize= 1024*1024*3;
@Module({
    controllers: [FileController],
    imports: [
      ConfigModule.forRoot(),
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      
      JwtModule.register({
        secret: process.env.JWTTOKEN,
      }),
  
      MulterModule.register({
        dest: './images',
        limits: { fileSize: maxSize }
        })   
    ],

  })
  export class fileModule {}
  