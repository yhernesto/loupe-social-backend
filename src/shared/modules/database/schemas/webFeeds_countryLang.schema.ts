import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { WebFeeds_countryLangINTF } from '../interfaces/WebFeeds/webFeeds_countryLang.intf'

export type WebFeeds_countryLangDocument = WebFeeds_countryLang & Document;

@Schema({collection: 'webfeeds_countrylang'})
export class WebFeeds_countryLang implements WebFeeds_countryLangINTF{
  _id: MongooseSchema.Types.ObjectId

  @Prop({type: String})
  country: string

  @Prop({ type: String})
  lang: string

  @Prop({ type: String})
  url_parameters: string
}

export const WebFeeds_countryLangSchema = SchemaFactory.createForClass(WebFeeds_countryLang);