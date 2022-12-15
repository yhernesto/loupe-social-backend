import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { HashtagRivalINTF, Rival } from '../interfaces/Hashtag/hashtagRival.intf';

export type Ig_hashtagRivalDocument = Ig_hashtagRival & Document;

@Schema({ timestamps: true })
export class Ig_hashtagRival implements HashtagRivalINTF{
  _id: MongooseSchema.Types.ObjectId

  @Prop({required: true})
  hashtag: string

  @Prop({ type: MongooseSchema.Types.Mixed })
  rival: Rival

  @Prop({type: Boolean, default: true})
  active: boolean

  @Prop()
  updatedAt: Date

  @Prop()
  createdAt: Date
}

export const HashtagRivalSchema = SchemaFactory.createForClass(Ig_hashtagRival);