import { Injectable } from '@nestjs/common';
import * as language from '@google-cloud/language';
import { TextSentimentINTF } from './interfaces/TextSentiment.intf';
import { removeEmptyLines, removeLinesWithSingleChars } from 'src/shared/utils/Utils';

@Injectable()
export class SentimentService {

  async analyseTextSentiment(rawText: string): Promise<TextSentimentINTF>{
    const client = new language.LanguageServiceClient();
    if(rawText){
      const clearedText = this.clearingText(rawText)

      const document: any = {
        content: clearedText,
        type: 'PLAIN_TEXT',
        encodingType: 'UTF8'
      };
  
      // Detects the sentiment of the text
      try{
        const [result] = await client.analyzeSentiment({document: document});
        if(result){
          const sentiment = result.documentSentiment;
          const textSentiment: TextSentimentINTF = {
            text: rawText,
            score: sentiment.score,
            magnitude: sentiment.magnitude
          }
          return textSentiment
        }
        return null
      }catch(e){ throw e }
    }else{
      return null
    }    
  }

  private clearingText(text: string): string | null{
    try{
      const textNoEmptyLines = removeEmptyLines(text)
      return removeLinesWithSingleChars(textNoEmptyLines) || null
    }catch(e){ throw e}
  }
  
}
