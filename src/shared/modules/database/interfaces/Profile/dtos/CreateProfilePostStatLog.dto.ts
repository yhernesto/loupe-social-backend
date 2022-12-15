import { Schema } from "mongoose"
import { IsNotEmpty } from "class-validator";
import { validateOrReject } from 'class-validator';
import { IProfilePostStatsLog } from "../ProfilePostStatsLog.intf";


export class CreateProfilePostStatsLogDTO implements IProfilePostStatsLog{
  _id?: Schema.Types.ObjectId

  @IsNotEmpty()
  _profile_id : Schema.Types.ObjectId

  @IsNotEmpty()
  post_shortcode: string

  comments: number
  lastComments?: number

  likes: number
  lastLikes?: number

  createdAt?: Date


  constructor(profilePostStatsLogINTF: Partial<IProfilePostStatsLog> = {}) {
    Object.assign(this, profilePostStatsLogINTF);
    this.validateMembers()
  }

  validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }
}