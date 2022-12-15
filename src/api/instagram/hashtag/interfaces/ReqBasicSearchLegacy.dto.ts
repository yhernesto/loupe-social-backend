import { IsDateString, IsNotEmpty, IsOptional } from "class-validator"

export interface ReqBasicSearchLegacyINTF {
  hashtag: string
  min_date: string
  max_date?: string
}

export class ReqBasicSearchLegacyDTO implements ReqBasicSearchLegacyINTF {
  @IsNotEmpty()
  hashtag: string

  @IsNotEmpty()
  @IsDateString()
  min_date: string

  @IsOptional()
  @IsDateString()
  max_date?: string;
}