import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, validateOrReject } from "class-validator";
import { IReqBasicSearchTS } from "./ReqBasicSearchTS.dto";

export interface IReqPopularPosts extends IReqBasicSearchTS {
    top: string
    hashtag: string
}

export class ReqPopularPostsDTO implements IReqPopularPosts {
    @IsNotEmpty()
    _profile_id: string

    @IsNotEmpty()
    @IsNumber()
    min_date: number
  
    @IsOptional()
    @IsNumberString()
    top: string

    @IsOptional()
    hashtag: string
  
    constructor(IPopularPosts: Partial<IReqPopularPosts> = {}){
      this._profile_id = IPopularPosts._profile_id;
      this.min_date = Number(IPopularPosts.min_date);
      this.top = IPopularPosts.top;
      this.hashtag = IPopularPosts.hashtag;
      this.validateMembers()
    }
  
    private validateMembers(){
      validateOrReject(this).catch(errors => {
        console.log('Promise rejected (validation failed). Errors: ', errors);
      });
    }
  
}