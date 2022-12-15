import { IsDate, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export interface ReqBasicSearchINTF {
  _profile_id: string
  min_date: Date
}


export class ReqBasicSearchDTO implements ReqBasicSearchINTF {
  @IsNotEmpty()
  @IsNumber()
  _profile_id: string

  @IsNotEmpty()
  @IsDate()
  min_date: Date
}