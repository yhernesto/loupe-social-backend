import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PlaceINTF } from '../interfaces/Place/Place.intf';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type Ig_placeDocument = Ig_place & Document;

@Schema()
export class Ig_place implements PlaceINTF{
  _id: MongooseSchema.Types.ObjectId

  @Prop({ required: true })
  ig_id:number

  @Prop()
  facebook_places_id: number

  @Prop()
  name: string

  @Prop()
  longitude: number

  @Prop()
  latitude: number

  @Prop()
  address: string

  @Prop()
  city: string

  @Prop()
  short_name: string
}

export const Ig_placeSchema = SchemaFactory.createForClass(Ig_place);