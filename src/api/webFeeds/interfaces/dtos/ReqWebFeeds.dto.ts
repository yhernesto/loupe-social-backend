import { IsAlpha, IsNotEmpty, IsOptional, IsString } from "class-validator"

export interface ReqWebFeedsINTF {
  direct_url?: string
  topic_url?: string
  section_url?: string
  search?: string
  location: string
  language: string
}

export class ReqWebFeedsDTO implements ReqWebFeedsINTF {
  @IsOptional()
  @IsString()
  topic_url?: string
  
  @IsOptional()
  @IsString()
  section_url?: string

  @IsOptional()
  @IsString()
  direct_url?: string

  @IsOptional()
  @IsAlpha()
  search?: string

  @IsNotEmpty()
  @IsAlpha()
  location: string

  @IsOptional()
  language: string

  // constructor(){
  //  DTOs used for HTTP communication doesn't need constructor because validation of its members is done in ValidationPipe
  // }
}