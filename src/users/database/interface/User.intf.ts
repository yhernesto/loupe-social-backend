import { Schema } from 'mongoose';

export interface UserINTF{
  _id?: Schema.Types.ObjectId
  client: Schema.Types.ObjectId
  email: string
  language: string
  country: string
  user_name: string
  first_name: string
  last_name: string
  password: string
  photo_url: string
}