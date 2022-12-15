import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IImage } from 'src/instagram/shared/interfaces/dtos/Image.intf';
import { ProfileStatsLogINTF } from '../interfaces/Profile/ProfileStatsLog.intf';

export type Ig_profileStatsLogDocument = Ig_profileStatsLog & Document;

const timeStamp = new Date();

@Schema()
export class Ig_profileStatsLog implements ProfileStatsLogINTF{
  _id: MongooseSchema.Types.ObjectId

  @Prop({ required: true })
  user_ig_id: number
  
  @Prop()
  media_count: number

  @Prop()
  following_count: number

  @Prop()
  follower_count: number

  @Prop()
  total_igtv_videos: number

  @Prop()
  total_clips_count: number

  @Prop()
  total_ar_effects: number

  @Prop()
  usertags_count: number

  @Prop()
  mutual_followers_count: number;

  @Prop({type: MongooseSchema.Types.Mixed})
  profile_pic?: IImage

  @Prop({default: timeStamp})
  createdAt: Date
}

export const Ig_profileStatsLogSchema = SchemaFactory.createForClass(Ig_profileStatsLog);
/*
Ig_profileStatsLogSchema.virtual('createdAt').get( function () {
  return this._id.getTimestamp();
});
*/