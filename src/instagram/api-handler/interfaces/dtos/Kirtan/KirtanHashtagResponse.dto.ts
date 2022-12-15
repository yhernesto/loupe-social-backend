export interface IHashtagResponse {
  moreAvailable: boolean
  nextMaxId: string
  nextPage: number
  nextMediaIds: any
  data: KirtanHashtagPost[]
}

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

export interface User {
  pk: number
  username: string
  full_name: string
  is_private: boolean
  profile_pic_url: string
  profile_pic_id: string
  
  follow_friction_type?: number
  is_favorite?: boolean
  is_verified?: boolean
  has_anonymous_profile_picture?: boolean
  is_unpublished?: boolean
  has_highlight_reels?: boolean
  account_badges?:any
  live_broadcast_id?: any
}


export interface UserTag {
  user: User
  start_time_in_video_in_sec: number
  duration_in_video_in_sec: number
  position:[
    number,
    number
  ]
}

export interface mediaSource {
  id: string
  media_type: number
  image_versions2: ImageVersion
  original_width: number
  original_height: number
  pk: string
  carousel_parent_id: string
  can_see_insights_as_brand: boolean
  usertags:{ in: UserTag[]}
  commerciality_status: string
  sharing_friction_info: any
}

export interface Location{
  pk:number,
  short_name: string,
  facebook_places_id: number,
  name: string,
  lng: number,
  lat: number,
  address: string,
  city: string,
}

export interface PostCaption{
  pk: number,
  user_id: number
  media_id: number,
  type: number
  is_covered: boolean,
  user: User,
  text: string,
  share_enabled: boolean,
  did_report_as_spam: boolean,
  content_type: string, //comment
  created_at_utc: number
  status: string
  has_translation:true
}

export interface KirtanHashtagPost {
  taken_at: number
  pk: string
  id: string
  device_timestamp: string
  media_type: number
  code: string
  client_cache_key: string
  filter_type: number
  carousel_media_count?: number       //when post is carousel
  carousel_media?: mediaSource[]      //when post is carousel
  image_versions2?: ImageVersion      //when post is an image 
  can_see_insights_as_brand: boolean
  is_unified_video: boolean
  location: Location
  lat: string
  lng: string
  user: User
  can_viewer_reshare: boolean
  caption_is_edited: boolean
  like_and_view_counts_disabled: boolean
  commerciality_status: string
  fundraiser_tag: any
  is_paid_partnership: boolean
  playlist_eligibility: boolean
  comment_likes_enabled: boolean
  comment_threading_enabled: boolean
  has_more_comments: boolean
  next_max_id: string
  max_num_visible_preview_comments: number
  preview_comments: any
  can_view_more_preview_comments: boolean
  comment_count: number
  hide_view_all_comment_entrypoint: boolean
  like_count: number
  has_liked: boolean
  top_likers: string[]
  photo_of_you: boolean
  usertags: { in: UserTag[]}
  is_organic_product_tagging_eligible: boolean
  caption: PostCaption
  can_viewer_save: boolean
  organic_tracking_token: string
  sharing_friction_info: any
  product_type: string
  is_in_profile_grid: boolean
  profile_grid_control_enabled: boolean
  deleted_reason: number
  integrity_review_decision: string
  music_metadata: any
}