import { Schema } from "mongoose"
import { TextSentimentINTF } from "src/third-party-apis/Google/Sentiment/interfaces/TextSentiment.intf";
import { IPostImage } from "./Image.intf";

export interface PostVideo{
  duration: number
  play_count: number
  url: string,
  width: number,
  height: number
  versions: VideoVersion[]
  view_count: number
  has_audio: boolean

  title?: string
  nearly_complete_copyright_match?: boolean
  media_cropping_info?: any
  thumbnails?: Thumbnails
  igtv_exists_in_viewer_series?: boolean
  is_post_live?: boolean
  video_codec?: string
  music_metadata?: any
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

export interface VideoVersion {
  height: number,
  width: number
  id: string,
  type: number,
  url: string,
}

export interface TagPostINTF{
  _id?: Schema.Types.ObjectId
  shortcode: string
  ig_id: string
  media_type: number  //1= image, 2=video
  _profile_id: Schema.Types.ObjectId
  comments_count: number
  likes_count: number
  image?: IPostImage
  video?: PostVideo
  text: TextSentimentINTF
  content_type: string
  is_covered: boolean
  share_enabled: boolean
  reported_as_spam: boolean
  place: Schema.Types.ObjectId
  has_liked?: boolean
  can_viewer_reshare?: boolean
  comment_likes_enabled?: boolean
  caption_is_edited?: boolean
  organic_tracking_token?: string
  can_see_insights_as_brand?: boolean
  photo_of_you?: boolean
  height?: number,
  width?: number,
  facepile_top_likers?: unknown
  is_paid_partnership?: boolean
  integrity_review?: string
  should_request_ads?: boolean
  product_type?: string
  like_and_view_counts_disabled?: boolean
  commerciality_status?: string
  number_of_qualities?: number

  carousel_media_count?: number
  taken_at: number

  createdAt?: Date
  updatedAt?: Date
}