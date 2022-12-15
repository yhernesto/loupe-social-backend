import { IsNotEmpty, IsNumber, IsObject, IsOptional, Min } from 'class-validator'
import { validateOrReject } from 'class-validator';
import { CommentINTF, SimpleUser } from '../comment.intf'
import { Schema } from 'mongoose';
import { TextSentimentINTF } from "src/third-party-apis/Google/Sentiment/interfaces/TextSentiment.intf";

export class CommentDTO implements CommentINTF{
  _id?: Schema.Types.ObjectId

  @IsNotEmpty()
  @IsNumber()
  ig_id: number

  @IsNotEmpty()
  post_shortcode: string
  
  @IsNotEmpty()
  post_owner_id: Schema.Types.ObjectId

  @IsNotEmpty()
  @IsObject()
  user: SimpleUser

  @Min(0)
  likes: number

  @IsOptional()
  media_id?: string
  
  share_enabled: boolean

  @IsObject()
  text: TextSentimentINTF

  private_reply_status: number
  reported_as_spam: boolean
  content_type: string

  @IsOptional()
  parent_comment_id?: number

  @IsOptional()
  child_comment_count?: number

  @IsOptional()
  has_liked_comment?: boolean

  @IsOptional()
  did_report_as_spam?: boolean

  @IsOptional()
  comment_index?: number

  taken_at: number

  constructor(commentINTF: Partial<CommentINTF> = {}) {
    Object.assign(this, commentINTF);
    this.validateMembers()
  }

  private validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }
}