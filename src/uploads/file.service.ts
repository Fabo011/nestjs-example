//Nest
import { Injectable } from '@nestjs/common';
//sharp file resizer
import * as sharp  from 'sharp';
//database
import { Model } from 'mongoose';
import { User } from '../schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
//jwt
import { JwtService } from '@nestjs/jwt';
//express features
import * as fs from 'fs'
import { promisify } from 'util';
const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class FileService{
    constructor(@InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
    ){}

  async fileResize(data: any): Promise<any>{

    //resize file and create new resized file
    await sharp(`./images/${data.oldFileName}`)
    .resize(80, 80).toFile(`./images/${data.newFileName}`).catch((err: any)=>{
          console.log(err); 
    });

    //delete old file
    await unlinkAsync(`./images/${data.oldFileName}`).catch((err: any)=>{
       if(err){console.log(err);}
    });

  };

  async saveResizedImage(data: any): Promise<any>{

    const Jwt: any= process.env.JWTTOKEN
    const decoded= this.jwtService.verify(data.token, Jwt);
    const access= decoded.username;
         
     //const image= `https://threesixty-server.herokuapp.com/files/my/${newFileName}`;
     const image= `http://localhost:3000/files/my/${data.newFileName}`;
     const user= await this.userModel.findOneAndUpdate({ username: access }, { image });

     if(!user){
         console.log('No User');
     }else{
        return { access };
     };

  };
    

};

