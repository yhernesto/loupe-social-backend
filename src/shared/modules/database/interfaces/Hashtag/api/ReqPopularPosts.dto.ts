import { IsOptional, IsNumberString, IsNotEmpty, validateOrReject } from "class-validator"
import { IReqBasicSearchTS } from "./ReqBasicSearchTS.dto"

export interface IReqHashtagPosts extends IReqBasicSearchTS {
  top: string
  _profile_id: string
}

export class ReqHashtagPostsDTO implements IReqHashtagPosts {
  @IsNotEmpty()
  hashtag: string

  @IsNotEmpty()
  min_timestamp: number

  @IsOptional()
  @IsNumberString()
  top: string

  @IsOptional()
  _profile_id: string

  constructor(popularPostsINTF: Partial<IReqHashtagPosts> = {}){
    this.hashtag = popularPostsINTF.hashtag;
    this.min_timestamp = Number(popularPostsINTF.min_timestamp);
    this.top = popularPostsINTF.top;
    this._profile_id = popularPostsINTF._profile_id;
    this.validateMembers()
  }

  private validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }

}