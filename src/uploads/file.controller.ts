import { Controller, Post, Injectable, UploadedFile, Bind, UseInterceptors, Redirect } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter } from './file.filter'

@Injectable()
@Controller('files')
export class FileController {
 
    @Redirect('/profile', 301)
    @Post('/upload')
        @UseInterceptors(FileInterceptor('file', {
            storage: diskStorage({
                destination: './images',
              }),
              fileFilter: imageFileFilter,
           }))
           @Bind(UploadedFile())
           uploadFile(file: any) {
           console.log(file);
            };
};