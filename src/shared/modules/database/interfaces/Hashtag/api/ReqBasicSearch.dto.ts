import { IsDate, IsNotEmpty, IsOptional, validateOrReject } from "class-validator";

export interface ReqBasicSearchINTF {
  hashtag: string
  min_date: Date
}


export class ReqBasicSearchDTO implements ReqBasicSearchINTF {
  @IsNotEmpty()
  hashtag: string

  @IsNotEmpty()
  @IsDate()
  min_date: Date

  constructor(basicSearchINTF: Partial<ReqBasicSearchINTF> = {}) {
    Object.assign(this, basicSearchINTF);
    this.validateMembers()
  }

  private validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }

}