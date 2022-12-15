import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { video_props, position, CreateTagINTF } from '../interfaces/Tag/createTag.intf'

export type Ig_tagDocument = Ig_tag & Document;

@Schema()
export class Ig_tag implements CreateTagINTF{
  _id: MongooseSchema.Types.ObjectId

  @Prop({ required: true })
  post_shortcode: string

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Ig_profile' })
  owner_id: MongooseSchema.Types.ObjectId
  
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Ig_profile' })
  tagged_id: MongooseSchema.Types.ObjectId

  video: video_props

  position: position

  @Prop({default: Date.now})
  createdAt: Date
}

export const Ig_tagSchema = SchemaFactory.createForClass(Ig_tag);