import { IsDateString, IsNotEmpty, IsOptional } from "class-validator"

export interface ReqAvgProfileStatsINTF {
  profile_ig_id: number
  min_date: string
  max_date?: string
}

export class ReqAvgProfileStatsDTO implements ReqAvgProfileStatsINTF {
  @IsNotEmpty()
  profile_ig_id: number

  @IsNotEmpty()
  @IsDateString()
  min_date: string

  @IsOptional()
  @IsDateString()
  max_date?: string
}