import { Schema } from 'mongoose';

export interface ISys_executionLog {
  client: Schema.Types.ObjectId,
  timestamp?: number,
  timesInDay: number,
  processedItems?: number,
  execution_state: number,
  execution_error?: string
}