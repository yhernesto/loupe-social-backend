import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { validateOrReject } from 'class-validator';
import { Schema } from "mongoose";
import { ISys_executionLog } from "../Sys_executionLog.intf";


export class CreateSysExecutionLogDTO implements ISys_executionLog{
  // @IsNotEmpty()
  timestamp: number

  @IsNotEmpty()
  client: Schema.Types.ObjectId

  @IsNotEmpty()
  timesInDay: number

  @IsOptional()
  processedItems?: number;

  @IsNotEmpty()
  @IsNumber()
  execution_state: number

  execution_error: string

  constructor(sys_executionLogINTF: Partial<ISys_executionLog> = {}) {
    Object.assign(this, sys_executionLogINTF);
    this.validateMembers()
  }

  validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }
}