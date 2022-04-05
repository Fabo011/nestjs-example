
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';

import { UserModule } from './auth/users.module';


const MongoDB:string= process.env.MONGODB;
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(MongoDB, { useNewUrlParser: true, useUnifiedTopology: true }),
     UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
 
})
export class AppModule {}
