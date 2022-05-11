//Nest
import { ConflictException, Injectable } from '@nestjs/common';
//Database
import { Model } from 'mongoose';
import { User } from '../schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
//bcrypt password
import * as bcrypt from 'bcryptjs';
//jwt
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService{
    constructor(@InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService
    ){}

    //save new user to database MongoDb
    //signup
    async saveUserAtSignUp(data: any): Promise<User>{
        //hash the password with standard md5
        const Salt= 10
        const hash = await bcrypt.hash(data.password, Salt);
        const image= 'http://localhost:3000/files/my/student-34d8.png';

        const user = new this.userModel({
          username: data.username,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          role: data.role,
          password: hash,
          image: image,
        });
        try {
          return user.save();
        } catch (error) {
          if (error.code === 11000) {
            throw new ConflictException('User already registered');
          }else{
              console.log(error);
              throw error;
          };
        };
    };

    //login
    async loginUser(data: any): Promise<User>{
       const theUser = await this.userModel.findOne({username: data.username}); 
       const passValid = await bcrypt.compare(data.password, theUser.password);
      if(!theUser){
        return null;
      }else if(!passValid){
         return null;
      }else{
        return this.userModel.findOne({username: data.username});
      };
    };

    //jwt token after signUp
    async jwtSignUp(data: any): Promise<any>{
      const payload = { username: data.username, role: data.role };
      const token = this.jwtService.sign(payload);
      return token;
    };

    //jwt token after login
    async jwtLogin(data: any): Promise<any>{
      const payload = { username: data.username, role: data.theRole };
      const token= this.jwtService.sign(payload);
      return token;
    };

};