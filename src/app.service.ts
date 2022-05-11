//Nest
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
//database
import { Model } from 'mongoose';
import { User } from './schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AppService{
    constructor(@InjectModel('User') private userModel: Model<User>
    ){}

    async findOne(data: any): Promise<User> {        
        const user= await this.userModel.findOne({ username: data.theUser });
 
        if(!user){
          throw new HttpException('Invalid User', HttpStatus.FORBIDDEN);
         }else{
          return this.userModel.findOne({username: data.theUser});
         };
           
    };
 
};
