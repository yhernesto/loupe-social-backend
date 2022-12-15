import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ISys_executionLog } from '../interfaces/System/Sys_executionLog.intf';

export type Sys_profileLogDocument = Sys_profileLog & Document;

@Schema()
export class Sys_profileLog implements ISys_executionLog{
  _id: MongooseSchema.Types.ObjectId

  // @Prop({ required: true })
  @Prop({ type : Number, default: Date.now })
  timestamp: number

  @Prop({ required: true })
  timesInDay: number;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Client' })
  client: MongooseSchema.Types.ObjectId
  
  @Prop({ required: true })
  execution_state: number

  @Prop()
  execution_error: string
}

export const Sys_profileLogSchema = SchemaFactory.createForClass(Sys_profileLog);