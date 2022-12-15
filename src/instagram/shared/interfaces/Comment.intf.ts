import { Schema } from 'mongoose';

export interface IComment{
  _id?: Schema.Types.ObjectId
	parent_comment_id?: number,
  ig_id: number,
  post_shortcode: string,
  likes: number,
  media_id?: number,
  share_enabled: boolean,
  text: string, 
  private_reply_status: number,
  taken_at: number,
  content_type: string,
  user: SimpleUser
  reported_as_spam?: boolean,
	child_comment_count?: number
	has_liked_comment?: boolean,
	did_report_as_spam?: boolean,
	comment_index?: number
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