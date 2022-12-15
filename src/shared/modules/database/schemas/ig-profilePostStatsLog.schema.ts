import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IProfilePostStatsLog } from '../interfaces/Profile/ProfilePostStatsLog.intf';

export type Ig_profilePostStatsLogDocument = Ig_profilePostStatsLog & Document;

@Schema()
export class Ig_profilePostStatsLog implements IProfilePostStatsLog{
  _id?: MongooseSchema.Types.ObjectId

  @Prop({ required: true })
  _profile_id: MongooseSchema.Types.ObjectId

  @Prop({ required: true })
  post_shortcode: string

  @Prop({ required: true })
  comments: number

  @Prop({})
  lastComments?: number

  @Prop({ required: true })
  likes: number

  @Prop({})
  lastLikes?: number

  @Prop({type: Date, default: Date.now})
  createdAt: Date
}

export const Ig_profilePostStatsLogSchema = SchemaFactory.createForClass(Ig_profilePostStatsLog);