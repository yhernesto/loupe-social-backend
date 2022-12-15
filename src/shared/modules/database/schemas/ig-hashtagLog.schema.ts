import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HashtagLogINTF } from '../interfaces/Hashtag/hashtagLog.intf';

export type Ig_hashtagLogDocument = Ig_hashtagLog & Document;

@Schema()
export class Ig_hashtagLog implements HashtagLogINTF{
  @Prop({ required: true })
  hashtag: string;

  @Prop({ type: String, required: true })
  profile_image_src: string;

  @Prop()
  posts: number;
  
  @Prop()
  sentiment_score: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const Ig_hashtagLogSchema = SchemaFactory.createForClass(Ig_hashtagLog);