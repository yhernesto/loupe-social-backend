import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Ig_HashtagPost } from './ig-hashtagPost.schema'
import { media_type } from '../interfaces/Hashtag/hashtagPost.intf'


export type Ig_postDocument = Ig_post & Document;

@Schema({discriminatorKey: 'source_type'})
export class Ig_post {
  @Prop({
    type: String,
    required: true,
    enum: [Ig_HashtagPost.name],
  })
  source_type: string;

  @Prop({ required: true })
  ig_id: number;

  @Prop({ required: true })
  shortcode: string;

  @Prop()
  image_src: string;

  @Prop()
  likes: number;

  @Prop()
  comments: number;
  
  @Prop()  
  text: string;

  @Prop()  
  taken_at_timestamp:number;

  dimension: {
    width: number,
    height: number,
  };

  @Prop()  
  account_id: number;

  @Prop()
  media_type: media_type;

  @Prop()
  creation_date: Date;
}

export const Ig_postSchema = SchemaFactory.createForClass(Ig_post);