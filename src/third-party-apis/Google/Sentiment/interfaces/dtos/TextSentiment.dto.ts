import { IsDecimal, IsOptional, Max, Min } from 'class-validator'
import { validateOrReject } from 'class-validator';
import { TextSentimentINTF } from "../TextSentiment.intf";

export class TextSentimentDTO implements TextSentimentINTF {
  text: string

  @IsOptional()
  @IsDecimal()
  @Min(-1)
  @Max(1)
  score: number

  @IsOptional()
  @IsDecimal()
  @Min(-1)
  @Max(1)
  magnitude: number

  constructor(textSentimentINTF: Partial<TextSentimentINTF> = {}) {
    Object.assign(this, textSentimentINTF);
    this.validateMembers()
  }

  validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }

}