import { IsEnum, IsNotEmpty, IsOptional, Max, Min } from "class-validator";
import { AnalyzeProfileSentimentINTF, AnalyzeMode } from "../AnalyzeSentiment.intf";

export class AnalyzeProfileSentimentDTO implements AnalyzeProfileSentimentINTF {

  @IsOptional()
  _profile_id?: string

  @IsNotEmpty()
  @IsEnum(AnalyzeMode)
  analyze_mode: AnalyzeMode

  @IsNotEmpty()
  @Min(1)
  max_to_process: number

  @IsOptional()
  @Min(1)
  @Max(20160)  //2 week
  last_minutes?: number

  // constructor(){
  //  Objects used for HTTP communication doesn't need constructor because validation of its members is done in ValidationPipe
  // }
}