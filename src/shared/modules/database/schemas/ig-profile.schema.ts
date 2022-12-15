//https://www.instagram.com/drexlerjorge/?__a=1
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IImage } from 'src/instagram/shared/interfaces/dtos/Image.intf';
import { ProfileINTF } from '../interfaces/Profile/Profile.intf';

export type Ig_profileDocument = Ig_profile & Document;

@Schema({ timestamps: true })
export class Ig_profile implements ProfileINTF{
  _id: MongooseSchema.Types.ObjectId

  @Prop({ required: true })
  ig_id: number

  @Prop({ required: true })
  username: string

  @Prop({ required: true })
  full_name: string
  
  @Prop({ required: true,  type: MongooseSchema.Types.Mixed })
  profile_pic: IImage

  @Prop({ required: true })
  biography: string

  @Prop()
  is_verified: boolean


  //------------ Stats ------------
  @Prop()
  media_count?: number

  @Prop()
  following_count?: number

  @Prop()
  follower_count?: number

  @Prop()
  total_igtv_videos?: number

  @Prop()
  total_clips_count?: number

  @Prop()
  total_ar_effects?: number

  @Prop()
  usertags_count?: number

  @Prop()
  mutual_followers_count?: number;
  //--------------------------------


  @Prop()
  external_url?: string

  @Prop()
  has_videos?: boolean
  
  @Prop()
  category: string

  @Prop()
  account_type: number  

  @Prop()
  is_private: boolean
    
  @Prop()
  is_business?: boolean
    
  @Prop()
  is_favorite?: boolean
    
  @Prop()
  is_interest_account?: boolean
    
  @Prop()
  has_biography_translation?: boolean
    
  @Prop()
  direct_messaging?: string
    
  @Prop()
  has_highlight_reels?: boolean
    
  @Prop()
  has_chaining?: boolean
    
  @Prop()
  has_guides?: boolean
 
  @Prop()
  city_name?: string
    
  @Prop()
  zip?: string
    
  @Prop()
  city_id?: number

  @Prop()
  address_street?: string
    
  @Prop()
  longitude?: number
    
  @Prop()
  latitude?: number
    
  @Prop()
  public_email?: string
    
  @Prop()
  whatsapp_number?: string
    
  @Prop()
  contact_phone_number?: string
    
  @Prop()
  public_phone_country_code?: string
    
  @Prop()
  public_phone_number?: string
    
  @Prop()
  business_contact_method?: string
    
  @Prop()
  smb_delivery_partner?: string
    
  @Prop()
  smb_support_delivery_partner?: string
    
  @Prop()
  is_eligible_for_smb_support_flow?: boolean
    
  @Prop()
  is_potential_business?: boolean
    
  @Prop()
  is_memorialized?: boolean

  @Prop()
  can_be_reported_as_fraud?: boolean

  @Prop()
  updatedAt?: Date

  @Prop()
  createdAt?: Date
}

export const Ig_profileSchema = SchemaFactory.createForClass(Ig_profile)