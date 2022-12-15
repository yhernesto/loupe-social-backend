//https://www.instagram.com/drexlerjorge/?__a=1
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IInfluencer } from '../interfaces/Influencer/Influencer.intf';
import { Ig_profile } from 'src/shared/modules/database/schemas/ig-profile.schema'

export type Ig_influencerDocument = Ig_influencer & Document;

@Schema({ timestamps: true })
export class Ig_influencer implements IInfluencer{
  _id: MongooseSchema.Types.ObjectId

  @Prop({ required: true })
  ig_id: number

  @Prop({})
  full_name?: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Ig_profile' })
  profile?: Ig_profile

  @Prop()
  category?: string
  
  @Prop()
  is_business?: boolean
  
  @Prop()
  city_name?: string
  
  @Prop()
  email?: string
  
  @Prop()
  whatsapp_number?: string
  
  @Prop()
  clients_hashtags: string[]

  @Prop()
  updatedAt?: Date

  @Prop()
  createdAt?: Date
}

export const Ig_influencerSchema = SchemaFactory.createForClass(Ig_influencer)