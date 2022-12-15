import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ISys_executionLog } from '../interfaces/System/Sys_executionLog.intf';

export type Sys_profilePostsLogDocument = Sys_profilePostsLog & Document;

@Schema()
export class Sys_profilePostsLog implements ISys_executionLog{
  _id: MongooseSchema.Types.ObjectId

  @Prop({ type : Number, default: Date.now })
  timestamp: number

  @Prop({ required: true, default: 0 })
  timesInDay: number;
  
  @Prop({ required: true, default: 0 })
  processedItems: number;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Client' })
  client: MongooseSchema.Types.ObjectId
  
  @Prop({ required: true })
  execution_state: number

  @Prop()
  execution_error: string
}

export const Sys_profilePostsLogSchema = SchemaFactory.createForClass(Sys_profilePostsLog);