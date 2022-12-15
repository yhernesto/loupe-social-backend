import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IClient } from '../interface/Client.intf';
import { Ig_profile } from 'src/shared/modules/database/schemas/ig-profile.schema'
import { IPlan } from '../interface/Plan.intf';

export type ClientDocument = Client & Document;

@Schema({ timestamps: true })
export class Client implements IClient{
  _id: MongooseSchema.Types.ObjectId

  @Prop({ type: Boolean, default: true })
  active: boolean

  @Prop({ required: true })
  name: string

  @Prop({type: String})
  sector: string

  @Prop()
  description: string

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  plan: IPlan

  @Prop()
  ig_official_hashtag: string
  
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Ig_profile' })
  ig_official_profile: Ig_profile

  @Prop({type: Number})
  ig_likesToBeInfluencer: number

  @Prop()
  sub_hashtags?: string[]

  @Prop({type: Date})
  createdAt?: Date

  @Prop({type: Date})
  updatedAt?: Date

  @Prop()
  photo_url: string
}

export const ClientSchema = SchemaFactory.createForClass(Client);