//https://www.instagram.com/bembosoficial/?__a=1
import { IsAlpha, IsNotEmpty, IsUrl, IsLongitude, IsLatitude, IsEmail, validateOrReject, IsOptional, IsObject } from "class-validator";
import { Schema } from "mongoose";
import { IImage } from "./Image.intf";

export interface ProfileINTF {
  _id?: Schema.Types.ObjectId,
  ig_id: number,   //PK
  username: string,
  full_name: string,
  biography: string,
  profile_pic: IImage,

  external_url?: string,
  has_videos?: boolean,
  category?: string,
  account_type?: number,
  is_private?: boolean,
  is_business?: boolean,
  is_verified?: boolean,
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

  media_count?: number
  following_count?: number
  follower_count?: number
  total_igtv_videos?: number
  total_clips_count?: number
  total_ar_effects?: number
  usertags_count?: number
  mutual_followers_count?: number
}


export class ProfileDTO implements ProfileINTF{
  @IsNotEmpty()
  ig_id: number   //PK

  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  full_name: string

  biography: string
  is_verified: boolean
  
  @IsObject()
  profile_pic: IImage
  
  @IsOptional()
  external_url?: string

  has_videos?: boolean
  
  category?: string
  account_type?: number
  is_private?: boolean
  is_business?: boolean
  is_favorite?: boolean
  is_interest_account?: boolean
  has_biography_translation?: boolean
  direct_messaging?: string
  has_highlight_reels?: boolean
  has_chaining?: boolean
  has_guides?: boolean
 
  @IsOptional()
  city_name?: string

  zip?: string
  city_id?: number
  address_street?: string
  
  @IsOptional()
  @IsLongitude()
  longitude?: number

  @IsOptional()
  @IsLatitude()
  latitude?: number
  
  @IsOptional()
  public_email?: string

  whatsapp_number?: string
  contact_phone_number?: string
  public_phone_country_code?: string
  public_phone_number?: string
  business_contact_method?: string
  smb_delivery_partner?: string
  smb_support_delivery_partner?: string
  is_eligible_for_smb_support_flow?: boolean
  is_potential_business?: boolean
  is_memorialized?: boolean
  
  can_be_reported_as_fraud?: boolean

  media_count?: number
  following_count?: number
  follower_count?: number
  total_igtv_videos?: number
  total_clips_count?: number
  total_ar_effects?: number
  usertags_count?: number
  mutual_followers_count?: number

  constructor(profileINTF: Partial<ProfileINTF> = {}) {
    Object.assign(this, profileINTF);
    this.validateMembers()
  }

  validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }
}