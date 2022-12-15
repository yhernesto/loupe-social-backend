import { Controller, Get, Query, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { WebFeedsService } from './webFeeds.service';
import { ReqWebFeedsDTO } from './interfaces/dtos/ReqWebFeeds.dto';
import { ResWebFeedINTF } from './interfaces/dtos/ResWebFeed.dto';
import { ResWebFeedsCountryLanguagesINTF } from './interfaces/dtos/ResWebFeedsCountryLanguages.dto';
import { ResWebFeedTopicsINTF } from './interfaces/dtos/ResWebFeedTopics.dto';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';

@UseInterceptors(LoggingInterceptor)
@Controller('api/webFeeds')
export class WebFeedsController {
  constructor(private webFeedsService: WebFeedsService){}

  @Get('/getWebFeedsTopics')
  webFeedsTopics(): ResWebFeedTopicsINTF[]{
    try{
      return this.webFeedsService.getWebFeedsTopics()
    }catch(e){throw e}
  }
  
  @Get('/getWebFeedsCountryLang')
  webFeedsCountryLang(): ResWebFeedsCountryLanguagesINTF[]{
    try{
      return this.webFeedsService.getWebFeedsCountryLanguages()
    }catch(e){ throw e}
  }
  
  @Get('/getFeeds')
  async webTrends(@Query(new ValidationPipe()) reqWebFeedsDTO: ReqWebFeedsDTO): Promise<ResWebFeedINTF>{
    try{
      const tt = await this.webFeedsService.getFeeds(reqWebFeedsDTO)
      return tt
    }catch(e){ throw e }
  }
//  @Get('/getTopics')
//  async getTopics(): Promise<WebFeedsTopicsINTF[]>{
//    return await this.webFeedsService.getWebFeedsTopics()
//  }

}
