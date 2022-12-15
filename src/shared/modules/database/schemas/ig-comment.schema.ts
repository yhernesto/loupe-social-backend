import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CommentINTF, SimpleUser } from '../interfaces/Comments/comment.intf';
import { TextSentimentINTF } from "src/third-party-apis/Google/Sentiment/interfaces/TextSentiment.intf";

export type Ig_commentDocument = Ig_comment & Document;

@Schema()
export class Ig_comment implements CommentINTF{
  _id: MongooseSchema.Types.ObjectId

  @Prop({ required: true })
  ig_id: number

  @Prop({ required: true })
  post_shortcode: string

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Ig_profile' })
  post_owner_id: MongooseSchema.Types.ObjectId

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  user: SimpleUser

  @Prop({ required: true })
  likes: number

  @Prop({required: false})
  media_id?: string

  @Prop()
  share_enabled: boolean

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  text: TextSentimentINTF

  @Prop()
  private_reply_status: number
  
  @Prop()
  reported_as_spam: boolean
  
  @Prop()
  content_type: string
  
  @Prop({ required: true })
  taken_at: number

  @Prop({required: false})
  parent_comment_id?: number

  @Prop({required: false})
  child_comment_count?: number

  @Prop({required: false})
  has_liked_comment?: boolean

  @Prop({required: false})
  did_report_as_spam?: boolean

  @Prop({required: false})
  comment_index?: number

  @Prop({default: Date.now})
  createdAt: Date
}

export const Ig_commentSchema = SchemaFactory.createForClass(Ig_comment);