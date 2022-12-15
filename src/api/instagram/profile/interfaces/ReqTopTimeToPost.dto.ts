import { IsEnum, IsNumber } from "class-validator";
import { ReqBasicSearchDTO } from "./ReqBasicSearch.dto";

export enum TOP_HOURS_OPTIONS {
  'LIKES' = 0,
  'COMMENTS' = 1,
  'VIEWS' = 2
}

export class ReqTopTimeToPostDTO extends ReqBasicSearchDTO {
  
  @IsEnum(TOP_HOURS_OPTIONS)
  topOption: TOP_HOURS_OPTIONS

  @IsNumber()
  size: number
}