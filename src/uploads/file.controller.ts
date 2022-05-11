//nest
import { Controller, Post, Get, Res, Param, Injectable, UploadedFile, Bind, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
//file
import { diskStorage } from 'multer';
import { imageFileFilter } from './file.filter';
import { editFileName } from './file.filename';
//express features
import {  Request, Response } from 'express';
//guards
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/schemas/role.enum';
//service
import { FileService } from './file.service';

@Injectable()
@Controller('files')
export class FileController {
     constructor(private fileService: FileService) {}
 
  
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
                const newFileName= `new-${file.filename}`;
                const oldFileName= `${file.filename}`;
                await this.fileService.fileResize({ newFileName, oldFileName });
                       
                const token= req.cookies.access_token;
                const user= await this.fileService.saveResizedImage({ newFileName, token });
                
                 return res.redirect(`/profile/${user.access}`);
            };
           
            //display the image at specific path
            @Get('my/:imgpath')
            async myImage(@Param('imgpath') file, @Res() res): Promise<any>{
                return res.sendFile(file, { root: './images' });
            };

};
