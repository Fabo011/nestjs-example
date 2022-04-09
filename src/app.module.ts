import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';

import { UserModule } from './auth/users.module';
import { fileModule } from './uploads/file.module';
import { UserSchema } from './schemas/users.schema';

const MongoDB:string= process.env.MONGODB;
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(MongoDB, { useNewUrlParser: true, useUnifiedTopology: true }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
     UserModule,
     fileModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
