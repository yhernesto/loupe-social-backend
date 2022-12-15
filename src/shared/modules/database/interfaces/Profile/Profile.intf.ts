//https://www.instagram.com/bembosoficial/?__a=1
import { Schema as MongooseSchema } from 'mongoose';
import { IImage } from 'src/instagram/shared/interfaces/dtos/Image.intf';

export interface ProfileINTF {
  _id?: MongooseSchema.Types.ObjectId
  ig_id: number,   //PK
  username: string,
  full_name: string, 
  biography: string,
  profile_pic: IImage,
  is_verified?: boolean,

  media_count?: number,
  following_count?: number,
  follower_count?: number,
  total_igtv_videos?: number,
  total_clips_count?: number,
  total_ar_effects?: number,
  usertags_count?: number,
  mutual_followers_count?: number,

  external_url?: string,
  has_videos?: boolean,
  category?: string,
  account_type?: number,
  is_private?: boolean,
  is_business?: boolean,
  is_favorite?: boolean,
  is_interest_account?: boolean,
  has_biography_translation?: boolean,
  direct_messaging?: string,
  has_highlight_reels?: boolean,
  has_chaining?: boolean,
  has_guides?: boolean
 
  city_name?: string,
  zip?: string,
  city_id?: number,
  address_street?: string,
  longitude?: number,
  latitude?: number,
  
  public_email?: string,
  whatsapp_number?: string,
  contact_phone_number?: string,
  public_phone_country_code?: string,
  public_phone_number?: string,
  business_contact_method?: string,
  smb_delivery_partner?: string,
  smb_support_delivery_partner?: string,
  is_eligible_for_smb_support_flow?: boolean,
  is_potential_business?: boolean,
  is_memorialized?: boolean,
  can_be_reported_as_fraud?: boolean,

  updatedAt?: Date
  createdAt?: Date
}