import { IsNotEmpty, IsNumberString } from "class-validator"

export interface ReqProfileSummaryStatsINTF {
  profile_ig_id: string
  prev_per_min_date: number
  post_per_min_date: number
}

export class ReqProfileSummaryStatsDTO implements ReqProfileSummaryStatsINTF {
  @IsNotEmpty()
  @IsNumberString()
  profile_ig_id: string

  @IsNotEmpty()
  @IsNumberString()
  prev_per_min_date: number

  @IsNotEmpty()
  @IsNumberString()
  post_per_min_date: number
}