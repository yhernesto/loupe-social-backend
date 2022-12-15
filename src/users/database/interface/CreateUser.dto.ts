import { UserINTF } from './User.intf'
import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, IsUrl } from "class-validator";
import { Schema } from 'mongoose';

export class CreateUserDTO implements UserINTF{
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsAlphanumeric()
  user_name: string
  
  language: string

  country: string
  
  @IsString()
  @IsAlphanumeric()
  client: Schema.Types.ObjectId

  //@IsAlpha()
  first_name: string


  //@IsAlpha()
  last_name: string

  @IsNotEmpty()
  password: string

  @IsUrl()
  photo_url: string

  // constructor(){
  //  Objects used for HTTP communication doesn't need constructor because validation of its members is done in ValidationPipe
  // }
  
}