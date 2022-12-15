import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HashtagRelationINTF, HashtagRelationLogINTF } from '../interfaces/Hashtag/hashtagRelationLog.intf'

export type Ig_hashtagRelationLogDocument = Ig_hashtagRelationLog & Document;

@Schema()
export class Ig_hashtagRelationLog implements HashtagRelationLogINTF{
  @Prop({ required: true })
  parent: string
  
  @Prop({ required: true })
  relations: HashtagRelationINTF[]
  
  @Prop({ default: new Date() })
  createdAt: Date
}

export const Ig_hashtagRelationLogSchema = SchemaFactory.createForClass(Ig_hashtagRelationLog);
