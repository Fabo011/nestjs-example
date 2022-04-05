import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { UserCredentials } from './users.credentials';
import { User } from '../schemas/users.schema';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>,
  private jwtService: JwtService
  ) {}

  async signUp(userCredentials: UserCredentials): Promise<any> {
    const { username, firstname, lastname, email, password } = userCredentials;

    const Salt= 10
    const hash = await bcrypt.hash(password, Salt);
    
    const user = new this.userModel({ username, firstname, lastname, email, password: hash });

    try {
      await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User already registered');
      }
      throw error;
    };

    /*
    const payload = { email: email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
     */

  };
  
  async signIn(user: User) {
    const payload = { email: user.email, sub: user.username };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (valid) {
      return user;
    }

    return null;
  }

}