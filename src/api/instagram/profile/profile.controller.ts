import { Controller, Get, HttpException, HttpStatus, Query, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ReqProfileSummaryStatsDTO } from './interfaces/ReqProfileSummaryStats.dto';
import { ReqBasicSearchDTO } from './interfaces/ReqBasicSearch.dto';
import { ResBestTimeToPostINTF } from './interfaces/ResBestTimeToPost.intf';
import { IResProfileSummaryStats } from './interfaces/ResProfileSummaryStats.intf';
import { ProfileService } from './profile.service';
import { ResTopTimeToPostINTF } from './interfaces/ResTopTimeToPost.intf';
import { ResTextStatsINTF} from './interfaces/ResTextStats.intf';
import { ResStatsProgressByWeekDay } from './interfaces/ResStatsProgressByWeekDay.intf';
import { ResHashtagStatsINTF } from './interfaces/ResHashtagStats.intf';
import { LoggingInterceptor } from '../../interceptors/logging.interceptor';
import { IResCommentsSentimentScore } from './interfaces/ResCommentSentimentScore.int';
import { ResTaggedSummaryStatsDTO } from './interfaces/ResTaggedSummaryStats.int';

@UseInterceptors(LoggingInterceptor)
@Controller('api/ig/profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/profileSummaryAvgStats')
  async profileStats(@Query(new ValidationPipe()) reqSummaryAvgStatsDTO: ReqProfileSummaryStatsDTO): Promise<IResProfileSummaryStats>{
    try{
      const resProfileSummaryStats = await this.profileService.getProfileStatsSummary(reqSummaryAvgStatsDTO)
      return resProfileSummaryStats
    }catch(e){
      console.error(e)
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: e,
      }, HttpStatus.BAD_REQUEST);
    }
  }
  
  @Get('/bestTimeToPost')
  async bestTimeToPost(@Query(new ValidationPipe()) reqBestTimeToPostDTO: ReqBasicSearchDTO): Promise<ResBestTimeToPostINTF>{
    try{
      const resBestTimeToPost = await this.profileService.getBestTimeToPost(reqBestTimeToPostDTO)
      return resBestTimeToPost
    }catch(e){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: e,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/topTimeToPost')
  async topTimeToPost(@Query(new ValidationPipe()) reqTopBestTimeToPostDTO: ReqBasicSearchDTO): Promise<ResTopTimeToPostINTF>{
    try{
      const resTopBestTimeToPost = await this.profileService.getTopTimeToPost(reqTopBestTimeToPostDTO)
      return resTopBestTimeToPost
    }catch(e){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: e,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/hashtagStats')
  async hashtagStats(@Query(new ValidationPipe()) reqTopBestTimeToPostDTO: ReqBasicSearchDTO): Promise<ResHashtagStatsINTF[]>{
    try{
      const resTopBestTimeToPost = await this.profileService.getHashtagStats(reqTopBestTimeToPostDTO)
      return resTopBestTimeToPost
    }catch(e){
      throw e
    }
  }

  @Get('/PostsTextStats')
  async postsTextStats(@Query(new ValidationPipe()) reqNumberOfHashtagStatsDTO: ReqBasicSearchDTO): Promise<ResTextStatsINTF>{
    try{
      const resTopBestTimeToPost = await this.profileService.getPostTextStats(reqNumberOfHashtagStatsDTO)
      return resTopBestTimeToPost
    }catch(e){
      throw e
    }
  }

  @Get('/statsProgressByWeekDay')
  async statsProgressByWeekDay(@Query(new ValidationPipe()) reqNumberOfHashtagStatsDTO: ReqBasicSearchDTO): Promise<ResStatsProgressByWeekDay[]>{
    try{
      const resStatsProgress = await this.profileService.getStatsProgressByWeekDay(reqNumberOfHashtagStatsDTO)
      return resStatsProgress
    }catch(e){
      throw e
    }
  }

  @Get('/sentimentScoreComments')
  async getCommentsSentimentScore(@Query(new ValidationPipe()) reqSentimentScoreDTO: ReqBasicSearchDTO): Promise<IResCommentsSentimentScore>{
    try{
      const sentiment_score = await this.profileService.getSentimentScore(reqSentimentScoreDTO)
      return sentiment_score;
    }catch(e){throw e}
  }

  @Get('/taggedSummaryStats')
  async summaryStats(@Query(new ValidationPipe()) reqTopInfluencers: ReqBasicSearchDTO): Promise<ResTaggedSummaryStatsDTO>{
    try{
      const summaryStatsINTF = await this.profileService.getSummaryStats(reqTopInfluencers)
      const resSummaryStats = new ResTaggedSummaryStatsDTO(summaryStatsINTF)
      return resSummaryStats
    }catch(e){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
