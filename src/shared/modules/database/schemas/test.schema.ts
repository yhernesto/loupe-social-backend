import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HashtagPostINTF, media_type, dimensions } from '../interfaces/Hashtag/hashtagPost.intf'
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TextSentimentINTF } from 'src/third-party-apis/Google/Sentiment/interfaces/TextSentiment.intf';

export type TestDocument = Test & Document;

@Schema({timestamps: true})
export class Test {
  @Prop({ type: String, required: true })
  hashtag: string;
  
  @Prop()
  text: string;  

  @Prop({ required: true })
  shortcode: string;
}

export const TestSchema = SchemaFactory.createForClass(Test);