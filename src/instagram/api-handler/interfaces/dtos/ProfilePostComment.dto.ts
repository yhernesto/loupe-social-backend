import { IsNotEmpty, IsPositive, Min } from "class-validator"

export interface ProfilePostCommentINTF{
  comment_like_count: number,
  media_id: number,
  share_enabled: boolean,
  pk: number,
  user_id: number,
  text: string,
  private_reply_status: number,
  user:{
    pk: number,
    is_private: boolean,
    full_name: string,
    is_verified: boolean,
    username: string,
    profile_pic_url: string,
  },
  bit_flags: number,
  created_at_utc: number,
  did_report_as_spam: boolean,
  content_type: string,
  type: number
}

export class ProfilePostCommentDTO implements ProfilePostCommentINTF{
  @Min(0)
  comment_like_count: number

  media_id: number
  share_enabled: boolean
  pk: number

  @IsNotEmpty()
  @IsPositive()
  user_id: number
  
  text: string
  private_reply_status: number
  user:{
    pk: number
    is_private: boolean
    full_name: string
    is_verified: boolean
    username: string
    profile_pic_url: string
  }
  bit_flags: number
  created_at_utc: number
  did_report_as_spam: boolean
  content_type: string
  type: number
}

