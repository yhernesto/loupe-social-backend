import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HashtagPostINTF, media_type, dimensions } from '../interfaces/Hashtag/hashtagPost.intf'
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TextSentimentINTF } from 'src/third-party-apis/Google/Sentiment/interfaces/TextSentiment.intf';
import { IImage } from '../interfaces/Profile/Image.intf';

export type Ig_postDocument = Ig_HashtagPost & Document;

@Schema({timestamps: true})
export class Ig_HashtagPost implements HashtagPostINTF{
  @Prop({ type: String, required: true })
  hashtag: string;
  
  @Prop({ type: Boolean, required: true })
  is_top: boolean;

  @Prop({ required: true })
  ig_id: number;

  @Prop({ required: true })
  shortcode: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  image: IImage;

  @Prop()
  likes: number;

  @Prop()
  comments: number;
  
  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  text: TextSentimentINTF;

  @Prop()  
  taken_at_timestamp:number;

  @Prop({type: MongooseSchema.Types.Mixed} )
  dimensions: dimensions;

  @Prop()
  account_id: number;

  @Prop({})
  username?: string;

  @Prop()
  media_type: media_type;

  @Prop({})
  carousel_media_count?: number;

  @Prop({})
  can_see_insights_as_brand?: boolean;

  @Prop({})
  place_ig_id?: number

  @Prop({})
  is_paid_partnership?: boolean

  @Prop({})
  accessibility_caption?: string

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;
}

export const Ig_HashtagPostSchema = SchemaFactory.createForClass(Ig_HashtagPost);