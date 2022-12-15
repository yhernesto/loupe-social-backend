import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, validateOrReject } from "class-validator";
import { IReqBasicSearchTS } from "./ReqBasicSearchTS.dto";

export interface IReqPostsByProfile extends IReqBasicSearchTS {
  profile_ig_id: number
  limit: number
}

export class ReqPostsByProfileDTO implements IReqPostsByProfile {
  @IsNotEmpty()
  hashtag: string

  @IsNotEmpty()
  @IsNumber()
  min_timestamp: number

  @IsOptional()
  @IsNumber()
  limit: number

  @IsOptional()
  @IsNumber()
  profile_ig_id: number

  constructor(iReqPostsByProfile: Partial<IReqPostsByProfile> = {}) {
    this.hashtag = iReqPostsByProfile.hashtag;
    this.min_timestamp = Number(iReqPostsByProfile.min_timestamp);
    this.limit = iReqPostsByProfile.limit;
    this.profile_ig_id = iReqPostsByProfile.profile_ig_id;
    this.validateMembers()
  }

  private validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }

}