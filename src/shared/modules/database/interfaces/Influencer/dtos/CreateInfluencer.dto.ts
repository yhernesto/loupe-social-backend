import { IsNotEmpty, validateOrReject, IsOptional, MinLength, IsArray } from "class-validator";
import { Schema } from 'mongoose'
import { IInfluencer } from "../Influencer.intf";

export class CreateInfluencerDTO implements IInfluencer{
  _id?: Schema.Types.ObjectId

  @IsNotEmpty()
  ig_id: number   //PK

  @IsNotEmpty()
  full_name: string

  @IsArray()
  clients_hashtags: string[]

  category?: string
  is_business?: boolean
 
  @IsOptional()
  @MinLength(0)
  city_name?: string

  @IsOptional()
  public_email?: string

  whatsapp_number?: string
  contact_phone_number?: string
  updatedAt?: Date
  createdAt?: Date

  constructor(influencerINTF: Partial<IInfluencer> = {}) {
    Object.assign(this, influencerINTF);
    this.validateMembers()
  }

  private validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }
}