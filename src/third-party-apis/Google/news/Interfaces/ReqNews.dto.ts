import { IsBoolean, IsOptional, IsUrl, validateOrReject } from "class-validator";

export interface ReqNewsINTF {
  web_feeds_url: string
  trending_news_required?: boolean
  row_to_search?: number
}

export class ReqNewsDTO implements ReqNewsINTF{
  @IsUrl()
  //@Matches('') TODO: match with a valid google news url 
  web_feeds_url: string

  @IsOptional()
  @IsBoolean()
  trending_news_required: boolean

  row_to_search?: number

  constructor(reqNewsINTF: Partial<ReqNewsINTF> = {}) {
    Object.assign(this, reqNewsINTF);
    this.validateMembers()
  }

  private validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }
}