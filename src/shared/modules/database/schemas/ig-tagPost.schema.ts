import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TagPostINTF, PostVideo } from '../interfaces/Profile/TagPost.intf';
import { TextSentimentINTF } from "src/third-party-apis/Google/Sentiment/interfaces/TextSentiment.intf";
import { IPostImage } from '../interfaces/Profile/Image.intf';

export type Ig_tagPostDocument = Ig_tagPost & Document;

@Schema({timestamps: true})
export class Ig_tagPost implements TagPostINTF{
  _id?: MongooseSchema.Types.ObjectId

  @Prop({ required: true })
  shortcode: string

  @Prop({ required: true })
  ig_id: string

  @Prop({ required: true })
  media_type: number  //1= image, 2=video

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  text: TextSentimentINTF

  @Prop({ type: String })
  content_type: string

  @Prop({ type: Boolean })
  is_covered: boolean

  @Prop({ type: Boolean })
  share_enabled: boolean

  @Prop({ type: Boolean })
  reported_as_spam: boolean

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Ig_profile' })
  _profile_id: MongooseSchema.Types.ObjectId

  @Prop({ required: true })
  comments_count: number

  @Prop({ required: true })
  likes_count: number

  @Prop({ type: MongooseSchema.Types.Mixed })
  image: IPostImage

  @Prop({ type: MongooseSchema.Types.Mixed })
  video?: PostVideo

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Ig_place' })
  place: MongooseSchema.Types.ObjectId

  @Prop({})
  has_liked?: boolean

  @Prop({})
  can_viewer_reshare?: boolean

  @Prop({ required: true })
  comment_likes_enabled: boolean

  @Prop({ required: true })
  caption_is_edited: boolean

  @Prop({})
  organic_tracking_token?: string

  @Prop({})
  can_see_insights_as_brand?: boolean

  @Prop({})
  photo_of_you?: boolean

  @Prop( { type: MongooseSchema.Types.Mixed })
  facepile_top_likers?: unknown

  @Prop({})
  is_paid_partnership?: boolean

  @Prop({})
  integrity_review?: string

  @Prop()
  should_request_ads?: boolean

  @Prop({})
  product_type?: string

  @Prop({})
  like_and_view_counts_disabled?: boolean

  @Prop({})
  commerciality_status?: string

  @Prop({})
  number_of_qualities?: number

  @Prop({})
  carousel_media_count?: number

  @Prop({})
  taken_at: number

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date
}

export const Ig_tagPostSchema = SchemaFactory.createForClass(Ig_tagPost);