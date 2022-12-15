import { IsNotEmpty, IsNumber } from "class-validator";

export interface ReqProfileStatsINTF {
  profile_ig_id: number
}

export class ReqProfileStatsDTO implements ReqProfileStatsINTF {
  @IsNotEmpty()
  @IsNumber()
  profile_ig_id: number
}