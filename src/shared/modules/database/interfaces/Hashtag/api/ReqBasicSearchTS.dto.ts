import { IsNotEmpty, IsOptional, validateOrReject } from "class-validator";

export interface IReqBasicSearchTS {
  hashtag: string
  allTypeOfPosts?: boolean
  min_timestamp: number
  max_timestamp?: number
}

export class ReqBasicSearchTSDTO implements IReqBasicSearchTS {
  @IsNotEmpty()
  hashtag: string
  
  @IsOptional()
  allTypeOfPosts?: boolean

  @IsNotEmpty()
  min_timestamp: number

  @IsOptional()
  max_timestamp?: number

  constructor(basicSearchINTF: Partial<IReqBasicSearchTS> = {}){
    this.hashtag = basicSearchINTF.hashtag;
    this.allTypeOfPosts = basicSearchINTF.allTypeOfPosts;
    this.min_timestamp = Number(basicSearchINTF.min_timestamp);
    this.max_timestamp = basicSearchINTF.max_timestamp;
    this.validateMembers()
  }

  private validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }
}