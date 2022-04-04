
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';

const MongoDB:string= process.env.MONGODB;
@Module({
  imports: [MongooseModule.forRoot(MongoDB)],
  controllers: [AppController],
  providers: [AppService],
 
})
export class AppModule {}
