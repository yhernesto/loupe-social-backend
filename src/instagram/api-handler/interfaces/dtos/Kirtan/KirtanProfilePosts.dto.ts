import { Location, mediaSource, UserTag } from "./KirtanHashtagResponse.dto"

export interface ImageCandidates {
  height: number
  url: string
  width: number
  estimated_scans_sizes?: any
  scans_profile?: string
}

export interface ImageVersion {
  candidates: ImageCandidates[] 
}

export interface VideoVersion {
  height: number,
  width: number
  id: string,
  type: number,
  url: string,
}

export interface Thumbnails {
  video_length: number
  thumbnail_width: number
  thumbnail_height: number
  thumbnail_duration: string
  sprite_urls: any
  thumbnails_per_row: number
  total_thumbnail_num_per_sprite: number
  max_thumbnails_per_sprite: number
  sprite_width: number
  sprite_height: number
  rendered_width: number
  file_size_kb: number
}

export interface ProfileLite {
  account_badges: any[]
  full_name: string
  username: string
  is_private: boolean
  is_verified: boolean
  pk: number
  profile_pic_id: string
  profile_pic_url: string
  has_anonymous_profile_picture?: boolean
  is_favorite?: boolean
  is_unpublished?: boolean
  latest_reel_media?: number
  has_highlight_reels?: boolean
}

export interface Caption {
  bit_flags: number
  content_type: string
  created_at: number
  created_at_utc: number
  did_report_as_spam: boolean
  is_covered: boolean
  media_id: string
  pk: number
  private_reply_status: number
  share_enabled: boolean
  status: string
  text: string
  type: number
  user: ProfileLite
  user_id: number
}

export interface IKirtanProfilePost {
  can_see_insights_as_brand: boolean
  can_view_more_preview_comments: boolean
  can_viewer_reshare: boolean
  can_viewer_save: boolean
  caption: Caption
  caption_is_edited: boolean
  client_cache_key: string
  code: string
  comment_count: number
  comment_likes_enabled: boolean
  comment_threading_enabled: boolean
  deleted_reason: number
  device_timestamp: string
  filter_type: number
  has_liked: boolean
  has_more_comments: boolean
  id: string
  lng: number,
  lat: number,
  location: Location
  product_type: string
  image_versions2: ImageVersion
  inline_composer_display_condition: string
  inline_composer_imp_trigger_time: number
  is_in_profile_grid: boolean
  is_shop_the_look_eligible: boolean
  like_count: number
  likers: ProfileLite[]
  max_num_visible_preview_comments: number
  media_type: number
  organic_tracking_token: string
  original_height: number
  original_width: number
  photo_of_you: boolean
  pk: string
  preview_comments: any[]
  profile_grid_control_enabled: boolean
  sharing_friction_info: any
  taken_at: number
  top_likers: ProfileLite[]
  user: ProfileLite
  usertags:{ in: UserTag[]}
  
  carousel_media_count?: number
  carousel_media?: mediaSource[]
  is_unified_video?: boolean
  should_request_ads?: boolean
  like_and_view_counts_disabled?: boolean
  commerciality_status?: string
  is_paid_partnership?: boolean
  integrity_review_decision?: string
  video_duration: number,
  video_versions: VideoVersion[]
  play_count: number
  view_count: number
  has_audio: boolean
  title: string
  nearly_complete_copyright_match: boolean
  media_cropping_info: any
  thumbnails: Thumbnails
  igtv_exists_in_viewer_series: boolean
  is_post_live: boolean
  video_codec: string
  number_of_qualities: number
  music_metadata: any
}