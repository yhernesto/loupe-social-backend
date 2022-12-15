import { IsNotEmpty, IsUrl } from "class-validator";
import { IKirtanProfileResponse} from '../dtos/Kirtan/KirtanProfileResponse.dto'

export interface ProfileResponseINTF {
  pk: number,
  username: string,
  full_name: string,
  biography: string,
  category: string,
  is_private: boolean,
  media_count: number,
  following_count: number,
  follower_count: number,
  is_business: boolean,
  is_bestie: boolean,
  total_igtv_videos: number,
  is_verified: boolean,
  is_favorite: boolean,
  is_interest_account: boolean,
  public_phone_country_code: string,
  longitude: number,
  latitude: number,
  has_unseen_besties_media: boolean,
  mutual_followers_count: number,
  account_type: number,
  has_videos: boolean,
  can_hide_category: boolean,
  public_email: string,
  total_ar_effects: number,
  direct_messaging: string,
  can_hide_public_contacts: boolean,
  has_chaining: boolean,
  whatsapp_number: string,
  profile_pic_url: string,
  contact_phone_number: string,
  total_clips_count: number,
  city_name: string,
  following_tag_count: number,
  should_show_category: boolean,
  show_account_transparency_details: boolean,
  address_street: string,
  highlight_reshare_disabled: boolean,
  business_contact_method: string,
  external_url: string,
  open_external_url_with_in_app_browser: boolean,
  instagram_location_id: string,
  has_igtv_series?: boolean,
  zip: string,
  has_biography_translation?: boolean,
  should_show_public_contacts: boolean,
  is_potential_business: boolean,
  is_memorialized: boolean,
  has_guides: boolean,
  has_highlight_reels: boolean,
  is_call_to_action_enabled: boolean,
  can_be_reported_as_fraud: boolean,
  displayed_action_button_type?: string,
  displayed_action_button_partner?: string,
  has_anonymous_profile_picture: boolean,
  is_eligible_for_smb_support_flow: boolean,
  smb_delivery_partner?: string,
  smb_support_delivery_partner?: string,
  city_id: number,
  public_phone_number: string,
  usertags_count: number,
}


export class ProfileResponseDTO implements ProfileResponseINTF{
  @IsNotEmpty()
  pk: number

  @IsNotEmpty()
  username: string

  full_name: string
  biography: string
  category: string
  is_private: boolean
  media_count: number
  following_count: number
  follower_count: number
  is_business: boolean
  is_bestie: boolean
  total_igtv_videos: number
  is_verified: boolean
  is_favorite: boolean
  is_interest_account: boolean
  public_phone_country_code: string
  longitude: number
  latitude: number
  has_unseen_besties_media:boolean
  mutual_followers_count: number
  account_type: number
  has_videos: boolean
  can_hide_category: boolean
  public_email: string
  total_ar_effects: number
  direct_messaging: string
  can_hide_public_contacts: boolean
  has_chaining: boolean
  whatsapp_number: string

  @IsUrl()
  profile_pic_url: string

  contact_phone_number: string
  total_clips_count: number
  city_name: string
  following_tag_count: number
  should_show_category: boolean
  show_account_transparency_details: boolean
  address_street: string
  highlight_reshare_disabled: boolean
  business_contact_method: string

  external_url: string

  open_external_url_with_in_app_browser: boolean
  instagram_location_id: string
  has_igtv_series?: boolean
  zip: string
  has_biography_translation?: boolean
  should_show_public_contacts: boolean
  is_potential_business: boolean
  is_memorialized: boolean
  has_guides: boolean
  has_highlight_reels: boolean
  is_call_to_action_enabled: boolean
  can_be_reported_as_fraud: boolean
  displayed_action_button_type?: string
  displayed_action_button_partner?: string
  has_anonymous_profile_picture: boolean
  is_eligible_for_smb_support_flow: boolean
  smb_delivery_partner?: string
  smb_support_delivery_partner?: string
  city_id: number
  public_phone_number: string
  usertags_count: number

  constructor(profileResponseINTF: ProfileResponseINTF){
    this.pk = profileResponseINTF.pk
    this.username = profileResponseINTF.username
    this.full_name = profileResponseINTF.full_name
    this.biography = profileResponseINTF.biography
    this.category = profileResponseINTF.category
    this.is_private = profileResponseINTF.is_private
    this.media_count = profileResponseINTF.media_count
    this.following_count = profileResponseINTF.following_count
    this.follower_count = profileResponseINTF.follower_count
    this.is_business = profileResponseINTF.is_business
    this.is_bestie = profileResponseINTF.is_bestie
    this.total_igtv_videos = profileResponseINTF.total_igtv_videos
    this.is_verified = profileResponseINTF.is_verified
    this.is_favorite = profileResponseINTF.is_favorite
    this.is_interest_account = profileResponseINTF.is_interest_account
    this.public_phone_country_code = profileResponseINTF.public_phone_country_code
    this.longitude = profileResponseINTF.longitude
    this.latitude = profileResponseINTF.latitude
    this.has_unseen_besties_media = profileResponseINTF.has_unseen_besties_media
    this.mutual_followers_count = profileResponseINTF.mutual_followers_count
    this.account_type = profileResponseINTF.account_type
    this.has_videos = profileResponseINTF.has_videos
    this.can_hide_category = profileResponseINTF.can_hide_category
    this.public_email = profileResponseINTF.public_email
    this.total_ar_effects = profileResponseINTF.total_ar_effects
    this.direct_messaging = profileResponseINTF.direct_messaging
    this.can_hide_public_contacts = profileResponseINTF.can_hide_public_contacts
    this.has_chaining = profileResponseINTF.has_chaining
    this.whatsapp_number = profileResponseINTF.whatsapp_number
    this.profile_pic_url = profileResponseINTF.profile_pic_url
    this.contact_phone_number = profileResponseINTF.contact_phone_number
    this.total_clips_count = profileResponseINTF.total_clips_count
    this.city_name = profileResponseINTF.city_name
    this.following_tag_count = profileResponseINTF.following_tag_count
    this.should_show_category = profileResponseINTF.should_show_category
    this.show_account_transparency_details = profileResponseINTF.show_account_transparency_details
    this.address_street = profileResponseINTF.address_street
    this.highlight_reshare_disabled = profileResponseINTF.highlight_reshare_disabled
    this.business_contact_method = profileResponseINTF.business_contact_method
    this.external_url = profileResponseINTF.external_url
    this.open_external_url_with_in_app_browser = profileResponseINTF.open_external_url_with_in_app_browser
    this.instagram_location_id = profileResponseINTF.instagram_location_id
    this.has_igtv_series = profileResponseINTF.has_igtv_series
    this.zip = profileResponseINTF.zip
    this.has_biography_translation = profileResponseINTF.has_biography_translation
    this.should_show_public_contacts = profileResponseINTF.should_show_public_contacts
    this.is_potential_business = profileResponseINTF.is_potential_business
    this.is_memorialized = profileResponseINTF.is_memorialized
    this.has_guides = profileResponseINTF.has_guides
    this.has_highlight_reels = profileResponseINTF.has_highlight_reels
    this.is_call_to_action_enabled = profileResponseINTF.is_call_to_action_enabled
    this.can_be_reported_as_fraud = profileResponseINTF.can_be_reported_as_fraud
    this.displayed_action_button_type = profileResponseINTF.displayed_action_button_type
    this.displayed_action_button_partner = profileResponseINTF.displayed_action_button_partner
    this.has_anonymous_profile_picture = profileResponseINTF.has_anonymous_profile_picture
    this.is_eligible_for_smb_support_flow = profileResponseINTF.is_eligible_for_smb_support_flow
    this.smb_delivery_partner = profileResponseINTF.smb_delivery_partner
    this.smb_support_delivery_partner = profileResponseINTF.smb_support_delivery_partner
    this.city_id = profileResponseINTF.city_id
    this.public_phone_number = profileResponseINTF.public_phone_number
    this.usertags_count = profileResponseINTF.usertags_count
  }
}

export function profileINTFfromKirtanRes(kirtanProfile: IKirtanProfileResponse): ProfileResponseINTF{
  const profileResponseINTF: ProfileResponseINTF = {
    pk: kirtanProfile.pk,
    username : kirtanProfile.username,
    full_name : kirtanProfile.full_name,
    biography : kirtanProfile.biography,
    category : kirtanProfile.category,
    is_private : kirtanProfile.is_private,
    media_count : kirtanProfile.media_count,
    following_count : kirtanProfile.following_count,
    follower_count : kirtanProfile.follower_count,
    is_business : kirtanProfile.is_business,
    is_bestie : kirtanProfile.is_bestie,
    total_igtv_videos : kirtanProfile.total_igtv_videos,
    is_verified : kirtanProfile.is_verified,
    is_favorite : kirtanProfile.is_favorite,
    is_interest_account : kirtanProfile.is_interest_account,
    public_phone_country_code : kirtanProfile.public_phone_country_code,
    longitude : kirtanProfile.longitude,
    latitude : kirtanProfile.latitude,
    has_unseen_besties_media : kirtanProfile.has_unseen_besties_media,
    mutual_followers_count : kirtanProfile.mutual_followers_count,
    account_type : kirtanProfile.account_type,
    has_videos : null,
    can_hide_category : kirtanProfile.can_hide_category,
    public_email : kirtanProfile.public_email,
    total_ar_effects : kirtanProfile.total_ar_effects,
    direct_messaging : kirtanProfile.direct_messaging,
    can_hide_public_contacts : kirtanProfile.can_hide_public_contacts,
    has_chaining : kirtanProfile.has_chaining,
    whatsapp_number : '',
    profile_pic_url : kirtanProfile.profile_pic_url,
    contact_phone_number : kirtanProfile.contact_phone_number,
    total_clips_count : kirtanProfile.total_clips_count,
    city_name : kirtanProfile.city_name,
    following_tag_count : kirtanProfile.following_tag_count,
    should_show_category : kirtanProfile.should_show_category,
    show_account_transparency_details : kirtanProfile.show_account_transparency_details,
    address_street : kirtanProfile.address_street,
    highlight_reshare_disabled : kirtanProfile.highlight_reshare_disabled,
    business_contact_method : kirtanProfile.business_contact_method,
    external_url : kirtanProfile.external_url,
    open_external_url_with_in_app_browser : kirtanProfile.open_external_url_with_in_app_browser,
    instagram_location_id : kirtanProfile.instagram_location_id,
    zip : kirtanProfile.zip,
    should_show_public_contacts : kirtanProfile.should_show_public_contacts,
    is_potential_business : kirtanProfile.is_potential_business,
    is_memorialized : kirtanProfile.is_memorialized,
    has_guides : kirtanProfile.has_guides,
    has_highlight_reels : kirtanProfile.has_highlight_reels,
    is_call_to_action_enabled : kirtanProfile.is_call_to_action_enabled,
    can_be_reported_as_fraud : kirtanProfile.can_be_reported_as_fraud,
    has_anonymous_profile_picture : kirtanProfile.has_anonymous_profile_picture,
    is_eligible_for_smb_support_flow : kirtanProfile.is_eligible_for_smb_support_flow,
    city_id : kirtanProfile.city_id,
    public_phone_number : kirtanProfile.public_phone_number,
    usertags_count : kirtanProfile.usertags_count
  }
  return profileResponseINTF
}