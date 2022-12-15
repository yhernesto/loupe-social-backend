import { IsNumberString } from "class-validator";
import { ReqBasicSearchDTO } from "../ReqBasicSearch.dto";

export class ReqHashtagRelationRatioDTO extends ReqBasicSearchDTO {

  @IsNumberString()
  limit: string
}