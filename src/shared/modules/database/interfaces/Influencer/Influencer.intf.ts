//https://www.instagram.com/bembosoficial/?__a=1
import { Schema as MongooseSchema } from 'mongoose';
import { Ig_profile } from "src/shared/modules/database/schemas/ig-profile.schema";

export interface IInfluencer {
  _id?: MongooseSchema.Types.ObjectId
  ig_id: number,
  profile?: Ig_profile
  full_name?: string,

  category?: string,
  is_business?: boolean,
  city_name?: string,
  email?: string,
  whatsapp_number?: string,
  contact_phone_number?: string,

  clients_hashtags?: string[]

  updatedAt?: Date
  createdAt?: Date
}