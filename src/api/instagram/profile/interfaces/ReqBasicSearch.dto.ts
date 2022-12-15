import { IsDateString, IsNotEmpty, IsNumberString, IsOptional } from "class-validator"

export interface ReqBasicSearchINTF {
  _profile_id: string
  min_date: number
}

export class ReqBasicSearchDTO implements ReqBasicSearchINTF {
  @IsNotEmpty()
  _profile_id: string

  @IsNotEmpty()
  @IsNumberString()
  min_date: number
}