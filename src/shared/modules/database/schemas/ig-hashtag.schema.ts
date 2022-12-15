import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HashtagINTF } from '../interfaces/Hashtag/hashtag.intf';

export type Ig_hashtagDocument = Ig_Hashtag & Document;

@Schema()
export class Ig_Hashtag implements HashtagINTF{
  @Prop({ required: true })
  hashtag: string;

  @Prop({ type: String, required: true })
  profile_image_src: string; 

  @Prop()
  posts: number;

  @Prop()
  sentiment_score: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const Ig_hashtagSchema = SchemaFactory.createForClass(Ig_Hashtag);