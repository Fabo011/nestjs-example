import { Controller, Post, Get, Res, Param,
     Injectable, UploadedFile, Bind, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter } from './file.filter';
import { editFileName } from './file.filename';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from '../schemas/users.schema';
import {  Request, Response } from 'express';

import * as sharp  from 'sharp';

import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/schemas/role.enum';

@Injectable()
@Controller('files')
export class FileController {
    constructor(@InjectModel('User') private userModel: Model<User>,
     private jwtService: JwtService
     ) {}
 
  
    @Roles(Role.PREMIUM)
    @UseGuards(RolesGuard)
    @Post('/upload')
        @UseInterceptors(FileInterceptor('file', {
            storage: diskStorage({
                destination: './images',
                filename: editFileName,
                }),
                fileFilter: imageFileFilter, 
           }))
           @Bind(UploadedFile())
          async uploadFile(file: any, @Req() req: Request, @Res() res: Response): Promise<any> {    
        
                //#issue
                //error-code [Error: Input file is missing]
                //noch keine Lösung gefunden, image wird in der Originalgröße gespeichert
                //Ansatz: Image mit sharp in die Größe 80, 80 bringen und danach newFilename in DB speichern
                //altes Image mit fs.unlink löschen
                const newFileName= `new-${file.filename}`;
                await sharp(__dirname + `/images/${file.filename}`)
                     .resize(80, 80).toFile(__dirname + `/images/${newFileName}`).catch((err: any)=>{
                           console.log(err); 
                     });
                       
                const filePath= file.filename; //const filePath= newFileName in case of sharp is working
                const token= req.cookies.access_token;
       
                const Jwt:any= process.env.JWTTOKEN
                const decoded= this.jwtService.verify(token, Jwt);
         
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                const access= decoded.username;
                const image= `https://threesixty-server.herokuapp.com/files/my/${filePath}`;
                const user= await this.userModel.findOneAndUpdate({ username: access }, { image });
                if(!user){console.log('No User');}
                
                 return res.redirect(`/profile/${access}`);
            };
           

            //display the image at specific path
            @Get('my/:imgpath')
            async myImage(@Param('imgpath') file, @Res() res){
                return res.sendFile(file, { root: './images' });
            };

};
