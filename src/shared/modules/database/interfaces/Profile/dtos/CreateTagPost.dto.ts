import { Schema } from "mongoose"
import { IsNotEmpty, IsObject, IsOptional } from "class-validator";
import { validateOrReject } from 'class-validator';
import { TextSentimentINTF } from "src/third-party-apis/Google/Sentiment/interfaces/TextSentiment.intf";
import { IPostImage } from "../Image.intf";
import { PostVideo, TagPostINTF } from "../TagPost.intf";


export class TagPostDTO implements TagPostINTF{
  _id?: Schema.Types.ObjectId

  @IsNotEmpty()
  shortcode: string

  @IsNotEmpty()
  ig_id: string

  media_type: number  //1= image, 2=video

  @IsObject()
  text: TextSentimentINTF

  content_type: string
  is_covered: boolean
  share_enabled: boolean
  reported_as_spam: boolean
  _profile_id: Schema.Types.ObjectId
  comments_count: number
  likes_count: number

  @IsOptional()
  @IsObject()
  image?: IPostImage

  @IsOptional()
  @IsObject()
  video?: PostVideo

  place: Schema.Types.ObjectId

  has_liked: boolean

  height: number
  width: number

  can_viewer_reshare?: boolean
  comment_likes_enabled?: boolean
  caption_is_edited?: boolean
  organic_tracking_token?: string
  can_see_insights_as_brand?: boolean
  photo_of_you?: boolean
  facepile_top_likers?: unknown
  is_paid_partnership?: boolean
  integrity_review?: string
  should_request_ads?: boolean

  @IsNotEmpty()
  taken_at: number


  constructor(tagPostINTF: Partial<TagPostINTF> = {}) {
    Object.assign(this, tagPostINTF);
    this.validateMembers()
  }

  validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }
}