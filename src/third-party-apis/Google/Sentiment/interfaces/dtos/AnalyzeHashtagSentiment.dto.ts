import { IsNotEmpty, IsOptional, Max, Min } from "class-validator";
import { AnalyzeHashtagSentimentINTF } from "../AnalyzeSentiment.intf";


export class AnalyzeHashtagSentimentDTO implements AnalyzeHashtagSentimentINTF {
  @IsOptional()
  hashtag?: string

  @IsNotEmpty()
  @Min(1)
  max_to_process: number

  @IsOptional()
  @Min(1)
  @Max(20160)  //1 week
  last_minutes?: number

  // constructor(){
  //  Objects used for HTTP communication doesn't need constructor because validation of its members is done in ValidationPipe
  // }
}