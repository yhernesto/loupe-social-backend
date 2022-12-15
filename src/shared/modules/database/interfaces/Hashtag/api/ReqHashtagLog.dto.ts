import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export interface ReqHashtagLogINTF {
  hashtag: string
  min_timestamp: number
  max_timestamp?: number
}


export class ReqHashtagLogDTO implements ReqHashtagLogINTF {
  @IsNotEmpty()
  hashtag: string

  @IsOptional()
  @IsNumber()
  min_timestamp: number

  @IsOptional()
  @IsNumber()
  max_timestamp?: number
}