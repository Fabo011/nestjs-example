import { Controller, Post, Get, Res, Param, Injectable, UploadedFile, Bind, UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter } from './file.filter'
import { editFileName } from './file.filename';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from '../schemas/users.schema';
import {  Request, Response } from 'express';


@Injectable()
@Controller('files')
export class FileController {
    constructor(@InjectModel('User') private userModel: Model<User>,
     private jwtService: JwtService
     ) {}
 
  
    @Post('/upload')
        @UseInterceptors(FileInterceptor('file', {
            storage: diskStorage({
                destination: './images',
                filename: editFileName,
              }),
              fileFilter: imageFileFilter,
           }))
           @Bind(UploadedFile())
           uploadFile(file: any, @Res() res: Response) {
           const filePath= file.filename;
           return res.redirect(`http://localhost:3000/files/${filePath}`);
            };
           
        

            @Get(':imgpath')
           async seeUploadedFile(@Param('imgpath') file, @Req() req: Request, @Res() res: Response, ) {
               
                const token= req.cookies.access_token;
       
                const Jwt:any= process.env.JWTTOKEN
                const decoded= this.jwtService.verify(token, Jwt);
         
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                const access= decoded.username;
                const image= `http://localhost:3000/files/my/${file}`;
                 
               const user= await this.userModel.findOneAndUpdate({ username: access }, { image });
                if(!user){console.log('No User');}
                
                 return res.redirect(`/profile/${access}`);
            };



            @Get('my/:imgpath')
            myImage(@Param('imgpath') file, @Res() res){
                return res.sendFile(file, { root: './images' });
            };

};
