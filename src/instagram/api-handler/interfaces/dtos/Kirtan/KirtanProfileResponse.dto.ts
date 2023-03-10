import { IKirtanProfilePost, ImageCandidates } from "./KirtanProfilePosts.dto";

export interface KirtanFeed {
  data: IKirtanProfilePost[],
  error: any
}

export interface IKirtanProfileResponse {
  account_badges: any[]
  account_type: number
  address_street: string
  auto_expand_chaining: boolean
  biography: string
  biography_with_entities: any
  business_contact_method: string
  can_be_reported_as_fraud: boolean
  can_hide_category: boolean
  can_hide_public_contacts: boolean
  category: any
  charity_profile_fundraiser_info: any
  city_id: number
  city_name: string
  contact_phone_number: string
  direct_messaging: any
  external_lynx_url: string
  external_url: string
  fb_page_call_to_action_id: string
  feed: KirtanFeed
  follower_count: number
  following_count: number
  following_tag_count: number
  full_name: string
  geo_media_count: number
  has_active_charity_business_profile_fundraiser: boolean
  has_anonymous_profile_picture: boolean
  has_chaining: boolean
  has_guides: boolean
  has_highlight_reels: boolean
  has_unseen_besties_media: boolean
  hd_profile_pic_url_info: ImageCandidates
  hd_profile_pic_versions: ImageCandidates[]
  highlight_reshare_disabled: boolean
  include_direct_blacklist_status: boolean
  instagram_location_id: string
  is_bestie: boolean
  is_business: boolean
  is_call_to_action_enabled: boolean
  is_eligible_for_smb_support_flow: boolean
  is_facebook_onboarded_charity: boolean
  is_favorite: boolean
  is_favorite_for_highlights: boolean
  is_favorite_for_igtv: boolean
  is_favorite_for_stories: boolean
  is_interest_account: boolean
  is_memorialized: boolean
  is_potential_business: boolean
  is_private: boolean
  is_verified: boolean
  latitude: number
  live_subscription_status: string
  longitude: number
  media_count: number
  merchant_checkout_style: string
  mutual_followers_count: number
  open_external_url_with_in_app_browser: boolean
  pk: number
  professional_conversion_suggested_account_type: number
  profile_pic_id: string
  profile_pic_url: string
  public_email: string
  public_phone_country_code: string
  public_phone_number: string
  robi_feedback_source: any
  seller_shoppable_feed_type: string
  shoppable_posts_count: number
  should_show_category: boolean
  should_show_public_contacts: boolean
  show_account_transparency_details: boolean
  show_leave_feedback: boolean
  show_post_insights_entry_point: boolean
  show_shoppable_feed: boolean
  smb_support_partner: any
  total_ar_effects: number
  total_clips_count: number
  total_igtv_videos: number
  username: string
  usertags_count: number
  zip: string
  whatsapp_number: string
  biography_product_mentions: any[]
}