import { IsDate, IsNotEmpty, IsNumberString, IsOptional, validateOrReject } from "class-validator";
import { ReqBasicSearchINTF } from "../../Hashtag/api/ReqBasicSearch.dto";

export interface ReqHashtagRelationRatioINTF extends ReqBasicSearchINTF {
  limit: string
}

export class ReqHashtagRelationRatioDTO implements ReqHashtagRelationRatioINTF {
  @IsNotEmpty()
  hashtag: string

  @IsNotEmpty()
  @IsDate()
  min_date: Date

  @IsOptional()
  @IsNumberString()
  limit: string

  constructor(popularPostsINTF: Partial<ReqHashtagRelationRatioINTF> = {}) {
    Object.assign(this, popularPostsINTF);
    this.validateMembers()
  }

  private validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }

}