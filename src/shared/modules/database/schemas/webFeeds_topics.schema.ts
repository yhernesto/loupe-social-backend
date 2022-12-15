import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { section, WebFeeds_topicsINTF } from '../interfaces/WebFeeds/webFeeds_topics.intf'

export type WebFeeds_TopicsDocument = WebFeeds_Topics & Document;

@Schema({collection: 'webfeeds_topics'})
export class WebFeeds_Topics implements WebFeeds_topicsINTF{
  _id: MongooseSchema.Types.ObjectId

  @Prop({required: true})
  country: string

  @Prop({required: true})
  lang: string

  @Prop({type: String, required: true})
  topic: string
  
  @Prop({type: String, required: true})
  gf_icon: string
  
  @Prop({type: Number})
  order: number

  @Prop({ type: MongooseSchema.Types.Mixed })
  sections?: section[]
 
  @Prop({type: String})
  url: string
}

export const WebFeeds_topicsSchema = SchemaFactory.createForClass(WebFeeds_Topics);