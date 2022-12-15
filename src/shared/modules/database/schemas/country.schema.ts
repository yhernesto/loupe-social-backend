import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { CountryINTF } from '../interfaces/Common/Country.dto'

export type CountryDocument = Country & Document;

@Schema()
export class Country implements CountryINTF{
  _id: MongooseSchema.Types.ObjectId

  @Prop({type: String})
  iso2: string

  @Prop({ type: String})
  default_lang?: string
}

export const CountrySchema = SchemaFactory.createForClass(Country);