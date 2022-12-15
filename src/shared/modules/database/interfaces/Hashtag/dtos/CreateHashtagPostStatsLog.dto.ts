import { IsNotEmpty, IsPositive, validateOrReject } from "class-validator"
import { HashtagPostStatsLogINTF } from "../HashtagPostStatsLog.intf"

export class HashtagPostStatsLogDTO implements HashtagPostStatsLogINTF {
  @IsNotEmpty()
  shortcode: string

  @IsNotEmpty()
  @IsPositive()
  likes: number

  @IsNotEmpty()
  @IsPositive()
  comments: number

  constructor(hashtagPostStatsLogINTF: Partial<HashtagPostStatsLogINTF> = {}) {
    Object.assign(this, hashtagPostStatsLogINTF);
    this.validateMembers()
  }

  validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }
}