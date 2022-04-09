import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/schemas/role.enum';

import { Model } from 'mongoose';
import { User } from '../schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector,
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService
    ) {}

 async canActivate(context: ExecutionContext) {
        // what is the required role?
        const requiredRole = this.reflector.getAllAndOverride<Role[]>('roles', [
          context.getHandler(),
          context.getClass(),
        ]);

        //if the route have no roles, then return true immediately
        if(!requiredRole){
          return true;
        };
        
        //does the user have the role?
        const request = context.switchToHttp().getRequest();
        const token= request.cookies.access_token;
       
        const Jwt:any= process.env.JWTTOKEN
        const decoded= this.jwtService.verify(token, Jwt);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                const access= decoded.username;
                const user= await this.userModel.findOne({ username: access });
            
          //return the result
        return requiredRole.some((role) => user.role?.includes(role));
  };
};