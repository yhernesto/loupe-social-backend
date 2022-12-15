import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type Tt_postDocument = Tt_post & Document;

@Schema()
export class Tt_post {
  @Prop({ required: true })
  tt_id: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  account_name: string;

  @Prop()
  account_full_name: string;
  
  @Prop()
  likes: number;
  
  @Prop()
  comments: number;
  
  @Prop()
  shares: number;  

  @Prop()
  song_title: string;  
  
  @Prop()
  text: string;

  //@Prop({ default: new Date()})
  @Prop()
  creation_date: Date;
}

export const Tt_postSchema = SchemaFactory.createForClass(Tt_post);