import { Controller, Get } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
@Controller('hashtag')
export class HashtagController {
  constructor(private hashtagService: HashtagService){}

  @Get('/testCont')
  async webFeedsTopics(): Promise<void>{
    const pp = await this.hashtagService.getHashtagRivals('adidasperu')
    console.log(pp)
  }
}