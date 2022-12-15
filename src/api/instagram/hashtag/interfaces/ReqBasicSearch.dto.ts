import { IsNotEmpty, IsNumber, IsNumberString, IsOptional } from "class-validator"

export interface ReqBasicSearchINTF {
  hashtag: string
  min_date: number
  _profile_id: string
}

export class ReqBasicSearchDTO implements ReqBasicSearchINTF {
  @IsNotEmpty()
  hashtag: string

  @IsNotEmpty()
  @IsNumberString()
  min_date: number

  //@IsNumber()
  @IsOptional()
  _profile_id: string
}