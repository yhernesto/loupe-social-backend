import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserINTF } from '../interface/User.intf'


export type UserDocument = User & Document;

@Schema()
export class User implements UserINTF{
  _id: MongooseSchema.Types.ObjectId

  @Prop()
  email: string

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Client' })
  client: MongooseSchema.Types.ObjectId

  @Prop()
  user_name: string
  
  @Prop()
  language: string  
  
  @Prop()
  country: string

  @Prop()
  first_name: string

  @Prop()
  last_name: string

  @Prop()
  password: string

  @Prop()
  photo_url: string

}

export const UserSchema = SchemaFactory.createForClass(User);