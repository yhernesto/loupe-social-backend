import { Thumbnails, VideoVersion } from './dtos/Kirtan/KirtanProfilePosts.dto';
import { ProfilePostCommentINTF } from  './dtos/ProfilePostComment.dto'

interface User{
  is_private: boolean,
  pk: number,
  full_name: string,
  profile_pic_id: string,
  username: string,
  profile_pic_url: string,
  
  follow_friction_type?: number,
  is_favorite?: boolean,
  is_unpublished?: boolean
  is_verified?: boolean,
  account_badges?: any,
  latest_reel_media?: number,
  has_anonymous_profile_picture?: boolean,
  has_highlight_reels?: boolean
}

interface Location{
  pk:number,
  facebook_places_id: number,
  name: string,
  lng: number,
  lat: number,
  address: string,
  city: string,
  short_name: string,
}

interface UserTag{
  start_time_in_video_in_sec: number,
  position:[
    number,
    number
  ],
  duration_in_video_in_sec: number,
  user: User
}

export interface PostCaption{
  pk: number,
  media_id: number,
  is_covered: boolean,
  user: User,
  text: string,
  share_enabled: boolean,
  did_report_as_spam: boolean,
  content_type: string, //comment
  created_at_utc: number
  // user:{
  //   pk: number,
  //   username: string,
  //   full_name: string,
  //   profile_pic_url: string,
  //   has_anonymous_profile_picture: boolean,
  //   is_verified: boolean,
  //   latest_reel_media: number,
  //   account_badges: unknown,
  //   story_reel_media_ids: unknown,
  // },
}

interface ImageCandidate{
  url: string,
  width: number,
  height: number,
  estimated_scans_sizes?: any
  scans_profile?: string
}

export interface ITagPost{
  code: string,
  pk: string,
  media_type: number,  //1= image, 2=video
  is_paid_partnership: boolean,
  integrity_review_decision: string,
  should_request_ads: boolean,
  lng: number,
  lat: number,
  location: Location,
  comment_count: number,
  has_liked: boolean,
  like_count: number,
  comments: ProfilePostCommentINTF[],
  product_type: string
  usertags: {
      in: UserTag[]
  },
  organic_tracking_token: string,
  original_height: number,
  original_width: number,
  can_see_insights_as_brand: boolean,
  photo_of_you: boolean,
  can_viewer_reshare: boolean,
  comment_likes_enabled: boolean,
  caption_is_edited: boolean,
  caption: PostCaption,
  user: User
  image_versions2:{
      candidates: ImageCandidate[]
  },

  // video properties
  video_duration?: number,
  video_versions?: VideoVersion[]
  play_count?: number
  view_count?: number
  has_audio?: boolean
  title?: string
  nearly_complete_copyright_match?: boolean
  media_cropping_info?: any
  thumbnails?: Thumbnails
  igtv_exists_in_viewer_series?: boolean
  is_post_live?: boolean
  video_codec?: string
  number_of_qualities?: number

  taken_at: number
}