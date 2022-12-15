import { Schema } from 'mongoose';
import { TextSentimentINTF } from "src/third-party-apis/Google/Sentiment/interfaces/TextSentiment.intf";

export interface CommentINTF{
  _id?: Schema.Types.ObjectId 
  ig_id: number,
  post_shortcode: string,
  post_owner_id: Schema.Types.ObjectId, 
  user: SimpleUser,
  media_id?: string,
  likes: number,
  share_enabled: boolean,
  text: TextSentimentINTF, 
  private_reply_status: number,
  taken_at: number,
  reported_as_spam: boolean,
  content_type: string,
  parent_comment_id?: number,
  child_comment_count?: number
  has_liked_comment?: boolean,
  did_report_as_spam?: boolean,
  comment_index?: number,
  createdAt?: Date
}
export interface SimpleUser {
ig_id: number
username?: string
full_name?: string
is_private?: boolean
is_verified?: boolean
is_mentionable?: boolean
has_anonymous_profile_picture?: boolean
}