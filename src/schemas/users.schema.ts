
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from './role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop({unique: true})
  username: string;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: Role, default: Role.STANDARD})
  role: Role;

  @Prop()
  image: string;
  
}

export const UserSchema = SchemaFactory.createForClass(User);
