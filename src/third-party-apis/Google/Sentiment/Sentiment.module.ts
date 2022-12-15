//https://cloud.google.com/natural-language/docs/basics
import { Module } from '@nestjs/common';
import { SentimentService } from './Sentiment.service';

@Module({
  providers: [SentimentService],
  exports: [SentimentService]
})
export class SentimentModule {}
