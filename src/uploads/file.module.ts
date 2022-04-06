import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from './file.controller';

const maxSize= 1024*1024*3;
@Module({
    controllers: [FileController],
    imports: [
  
      MulterModule.register({
        dest: './images',
        limits: { fileSize: maxSize }
        })

    ],
    
  })
  export class fileModule {}