import { IsOptional, IsNumberString } from "class-validator"
import { ReqBasicSearchDTO } from "../ReqBasicSearch.dto"

export class ReqHashtagPostsDTO extends ReqBasicSearchDTO {

  @IsOptional()
  @IsNumberString()
  top: string

  @IsOptional()
  _profile_id: string
}