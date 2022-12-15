import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { IResLatestHashtagRelation, ResHashtagRelationLogINTF } from 'src/shared/modules/database/interfaces/Hashtag/api/ResHashtagRelationRatio.intf';
import { CreateHashtagRivalDTO } from 'src/shared/modules/database/interfaces/Hashtag/dtos/CreateHashtagRivals.dto';
import { LoggingInterceptor } from '../../interceptors/logging.interceptor';
import { HashtagService } from './hashtag.service';
import { ReqHashtagRelationRatioDTO } from './interfaces/dashboard/ReqHashtagRelationRation.intf';
import { ReqHashtagPostsDTO } from './interfaces/dashboard/ReqPopularPosts.dto';
import { ResHashtagRelationRatioDTO } from './interfaces/dashboard/ResHashtagRelationRation.intf';
import { IResHashtagRival } from './interfaces/dashboard/ResHashtagRivals.intf';
import { ResHashtagRivalsStatsINTF } from './interfaces/dashboard/ResHashtagRivalsStats.intf';
import { IResPopularPosts } from './interfaces/dashboard/ResPopularPosts.intf';
import { IResLimitsSentiments, IResSentimentScore } from './interfaces/dashboard/ResSentimentScore.intf';
import { ResHashtagSummaryStatsDTO } from './interfaces/dashboard/ResHashtagSummaryStats.intf';
import { ReqBasicSearchDTO } from './interfaces/ReqBasicSearch.dto';
import { ReqBasicSearchLegacyDTO } from './interfaces/ReqBasicSearchLegacy.dto';
import { IResTopInfluencerLite, IResTopInfluencersNew, ResTopInfluencersDTO } from './interfaces/ResTopInfluencers.intf';

@UseInterceptors(LoggingInterceptor)
@Controller('api/ig/hashtag')
export class HashtagController {
  constructor(private hashtagService: HashtagService) {}

  @Get('/hashtagSummaryStats')
  async hashtagSummaryStats(@Query(new ValidationPipe()) reqTopInfluencers: ReqBasicSearchDTO): Promise<ResHashtagSummaryStatsDTO>{
    try{
      const summaryStatsINTF = await this.hashtagService.getSummaryStats(reqTopInfluencers)
      const resSummaryStats = new ResHashtagSummaryStatsDTO(summaryStatsINTF)
      return resSummaryStats
    }catch(e){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/topInfluencers')
  async topInfluencers(@Query(new ValidationPipe()) reqTopInfluencers: ReqBasicSearchDTO): Promise<ResTopInfluencersDTO>{
    try{
      const resTopInfluencersINTF = await this.hashtagService.getTopInfluencers(reqTopInfluencers)
      const resTopInfluencers = new ResTopInfluencersDTO(resTopInfluencersINTF)
      return resTopInfluencers
    }catch(e){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/topInfluencersNew')
  async topInfluencersNew(@Query(new ValidationPipe()) reqTopInfluencers: ReqBasicSearchDTO): Promise<IResTopInfluencersNew[]>{
    try{
      const resTopInfluencers = await this.hashtagService.getTopInfluencersNew(reqTopInfluencers)
      return resTopInfluencers
    }catch(e){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/topInfluencersLite')
  async topInfluencersLite(@Query(new ValidationPipe()) reqTopInfluencers: ReqBasicSearchDTO): Promise<IResTopInfluencerLite[]>{
    try{
      const resTopInfluencersLite = await this.hashtagService.getTopInfluencersLite(reqTopInfluencers)
      return resTopInfluencersLite
    }catch(e){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/popularPosts')
  async popularPosts(
    @Query(new ValidationPipe()) reqHashtagPopularPostsDTO: ReqHashtagPostsDTO): Promise<IResPopularPosts[]>{
    try{
      const popularPosts = await this.hashtagService.getPopularPosts(reqHashtagPopularPostsDTO)
      return popularPosts
    }catch(e){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/latestPosts')
  async latestPosts(
    @Query(new ValidationPipe()) reqHashtagPostsDTO: ReqHashtagPostsDTO): Promise<IResPopularPosts[]>{
    try{
      const latestPosts = await this.hashtagService.getLatestPosts(reqHashtagPostsDTO)
      return latestPosts
    }catch(e){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/hashtagRivals')
  async hashtagRivals(@Query(new ValidationPipe()) reqBasicSearch: {hashtag: string}): Promise<IResHashtagRival[]>{
    try{
      const hashtagRivals = await this.hashtagService.getHashtagRivals(reqBasicSearch)
      return hashtagRivals
    }catch(e){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/hashtagRivalsStats')
  async hashtagRivalsStats(@Query(new ValidationPipe()) reqBasicSearch: ReqBasicSearchLegacyDTO): Promise<ResHashtagRivalsStatsINTF[]>{
    try{
      const hashtagRivalsStats = await this.hashtagService.getHashtagRivalsStats(reqBasicSearch)
      console.log(JSON.stringify(hashtagRivalsStats))
      return hashtagRivalsStats
    }catch(e){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/upsertHashtagRivals')
  async createHashtagRivals(@Body() createHashtagRival: CreateHashtagRivalDTO): Promise<void>{
    try{
      await this.hashtagService.createHashtagRival(createHashtagRival)
    }catch(e){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: e,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/hashtagRelationRatio')
  async hashtagRelationRatio(@Query(new ValidationPipe()) reqHashtagRelationRatio: ReqHashtagRelationRatioDTO): Promise<ResHashtagRelationRatioDTO>{
    try{
      const hashtagRelationRatioINTF = await this.hashtagService.getHashtagRelationRatio(reqHashtagRelationRatio)
      const hashtagRelationRatio = new ResHashtagRelationRatioDTO(hashtagRelationRatioINTF)
      return hashtagRelationRatio
    }catch(e){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Get('/lowerHashtagRelationRatio')
  async lowerHashtagRelationRatio(@Query(new ValidationPipe()) reqHashtagRelationRation: ReqHashtagRelationRatioDTO): Promise<ResHashtagRelationLogINTF[]>{
    try{
      const hashtagRelationRatios = await this.hashtagService.getLowerHashtagRelationRatio(reqHashtagRelationRation)
      return hashtagRelationRatios
    }catch(e){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/latestHashtagRelation')
  async latestHashtagRelation(@Query(new ValidationPipe()) reqHashtagRelationRation: ReqHashtagRelationRatioDTO): Promise<IResLatestHashtagRelation[]>{
    try{
      const latestHashtagRelation = await this.hashtagService.getLatestHashtagRelation(reqHashtagRelationRation)
      return latestHashtagRelation
    }catch(e){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get('/sentimentScore')
  async getSentimentScore(@Query(new ValidationPipe()) reqSentimentScore: ReqBasicSearchDTO): Promise<IResSentimentScore>{
    try{
      const resSentimentScoreINTF = await this.hashtagService.getSentimentScore(reqSentimentScore)
      return resSentimentScoreINTF
    }catch(e){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Get('/test')
  // async getClassifiedPost(@Query(new ValidationPipe()) reqSentimentScore: ReqBasicSearchDTO): Promise<any>{
  //   try{
  //     const resSentimentScoreINTF = await this.hashtagService.getClassifiedPosts(reqSentimentScore)
  //     return resSentimentScoreINTF
  //   }catch(e){
  //     throw new HttpException({
  //       status: HttpStatus.INTERNAL_SERVER_ERROR,
  //       error: 'INTERNAL_SERVER_ERROR',
  //     }, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  @Get('/sentimentLimitsScore')
  async getMaxMinSentiments(@Query(new ValidationPipe()) params: {hashtag: string, _profile_id: string}): Promise<IResLimitsSentiments>{
    try{
      const limitsSentimentIntf = await this.hashtagService.getMaxMinSentiments(params.hashtag, params._profile_id)
      return limitsSentimentIntf
    }catch(e){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}