import { IsNotEmpty, IsNumber } from "class-validator";
import { validateOrReject } from 'class-validator';
import { Schema } from "mongoose";
import { ISysHashtagPostsLog } from "../Sys_hashtagPostsLog.intf";


export class CreateSysHashtagPostsLogDTO implements ISysHashtagPostsLog{
  timestamp: number

  @IsNotEmpty()
  timesInDay: number
  
  @IsNotEmpty()
  hashtag?: string

  @IsNotEmpty()
  client: Schema.Types.ObjectId

  @IsNotEmpty()
  @IsNumber()
  execution_state: number

  execution_error: string

  constructor(sys_hashtagPostsINTF: Partial<ISysHashtagPostsLog> = {}) {
    Object.assign(this, sys_hashtagPostsINTF);
    this.validateMembers()
  }

  validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }
}