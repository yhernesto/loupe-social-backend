import { Injectable } from '@nestjs/common';
import { SCORE_POSTS_LIMIT } from 'src/shared/constants/constants';
import { Dashboard } from 'src/shared/constants/instagram.constants';
import { Db_HashtagService } from 'src/shared/modules/database/db_hashtag.service';
import { db_ProfileService } from 'src/shared/modules/database/db_profile.service';
import { IResLatestHashtagRelation, ResHashtagRelationLogINTF } from 'src/shared/modules/database/interfaces/Hashtag/api/ResHashtagRelationRatio.intf';
import { CreateHashtagRivalDTO } from 'src/shared/modules/database/interfaces/Hashtag/dtos/CreateHashtagRivals.dto';
import { ResLimitsSentiment } from 'src/shared/modules/database/interfaces/Profile/Api/ResLimitsStats.intf';
import { asyncForEach, roundDecimal, stringToUTC, timestampToDate } from 'src/shared/utils/Utils';
import { ReqHashtagRelationRatioDTO } from './interfaces/dashboard/ReqHashtagRelationRation.intf';
import { ReqHashtagPostsDTO } from './interfaces/dashboard/ReqPopularPosts.dto';
import { IResHashtagRelationRatio } from './interfaces/dashboard/ResHashtagRelationRation.intf';
import { IResHashtagRival } from './interfaces/dashboard/ResHashtagRivals.intf';
import { ResHashtagRivalsStatsINTF } from './interfaces/dashboard/ResHashtagRivalsStats.intf';
import { IResPopularPosts } from './interfaces/dashboard/ResPopularPosts.intf';
import { IResPostsSentimentScore, IResSentimentScore } from './interfaces/dashboard/ResSentimentScore.intf';
import { IResStats } from './interfaces/dashboard/ResStats.intf';
import { IResSummaryStats } from './interfaces/dashboard/ResHashtagSummaryStats.intf';
import { ReqBasicSearchDTO } from './interfaces/ReqBasicSearch.dto';
import { ReqBasicSearchLegacyDTO } from './interfaces/ReqBasicSearchLegacy.dto';
import { IResTopInfluencerLite, IResTopInfluencers, IResTopInfluencersNew } from './interfaces/ResTopInfluencers.intf';

@Injectable()
export class HashtagService {
  constructor(
    private db_hashtagService: Db_HashtagService,
    private db_profileService: db_ProfileService
  ){}

  async getTopInfluencersNew(reqBasicSearch: ReqBasicSearchDTO): Promise<IResTopInfluencersNew[]>{
    const { hashtag, min_date } = reqBasicSearch
    try{
      let idx = 0
      const topInfluencers = await this.db_hashtagService.getTopInfluencersNew({hashtag: hashtag, min_timestamp: min_date})
      await asyncForEach(topInfluencers, async (topInfluencer) => {
        if(topInfluencer.ig_id){
          const hashtagPosts = await this.db_hashtagService.getPostsByInfluencer({profile_ig_id: topInfluencer.ig_id, hashtag: hashtag, min_timestamp: min_date, limit: 1})
          if(hashtagPosts[0]){ topInfluencers[idx].LastHashtagPost = hashtagPosts[0] }
        }
        idx++
      })
      return topInfluencers
    }catch(e){ throw e }
  }

  async getTopInfluencers(reqBasicSearch: ReqBasicSearchDTO): Promise<IResTopInfluencers>{
    const { hashtag, min_date } = reqBasicSearch
    try{
      const topInfluencers = await this.db_hashtagService.getTopInfluencers({hashtag: hashtag, min_timestamp: min_date})
      return topInfluencers
    }catch(e){
      throw e
    }
  }

  async getTopInfluencersLite(reqTopInfluencersLite: ReqBasicSearchDTO): Promise<IResTopInfluencerLite[]>{
    const { hashtag, min_date } = reqTopInfluencersLite
    try{
      const topInfluencers = await this.db_hashtagService.getTopInfluencersLite({hashtag: hashtag, min_timestamp: min_date})
      return topInfluencers
    }catch(e){
      throw e
    }
  }

  async getPopularPosts(reqPopularPosts: ReqHashtagPostsDTO): Promise<IResPopularPosts[]> {
    const { hashtag, min_date, top, _profile_id } = reqPopularPosts
    try{
      const popularHashtagPosts = await this.db_hashtagService.getPopularPosts({hashtag: hashtag, min_timestamp: min_date, top: top, _profile_id: _profile_id})
      const popularTaggedPosts = await this.db_profileService.getPopularPosts({_profile_id: _profile_id, min_date: min_date, top: top, hashtag: hashtag})

      let popularPosts = popularHashtagPosts.concat(popularTaggedPosts)
      popularPosts.sort((a, b) => b.likes - a.likes)
      popularPosts = popularPosts.slice(0, parseInt(top))

      return popularPosts
    }catch(e){ throw e }
  }

  async getLatestPosts(reqHashtagPosts: ReqHashtagPostsDTO): Promise<IResPopularPosts[]> {
    const { hashtag, min_date, top, _profile_id } = reqHashtagPosts
    try{
      const latestHashtagPosts = await this.db_hashtagService.getLatestPosts({hashtag: hashtag, min_timestamp: min_date, top: top, _profile_id: _profile_id})
      const latestTaggedPosts = await this.db_profileService.getLatestPosts({_profile_id: _profile_id, min_date: min_date, top: top, hashtag: hashtag})

      let latestPosts = latestHashtagPosts.concat(latestTaggedPosts)
      latestPosts.sort((a,b) => b.takenAt - a.takenAt)
      latestPosts = latestPosts.slice(0, parseInt(top))

      return latestPosts
    }catch(e){ throw e }
  }

  async getHashtagRivalsStats(reqHashtagRivalsStats: ReqBasicSearchLegacyDTO): Promise<ResHashtagRivalsStatsINTF[]> {
    const { hashtag, min_date, max_date } = reqHashtagRivalsStats
    const min_ts = stringToUTC({date_str: min_date})
    const max_ts = stringToUTC({date_str: max_date ? max_date : min_date, end_of_day: true})
    const resHashtagRivalsStats: ResHashtagRivalsStatsINTF[] = []
    try{
      const rivalsStats = await this.db_hashtagService.getHashtagRivalsStats({hashtag: hashtag, min_timestamp: min_ts, max_timestamp: max_ts})
      await Promise.all(rivalsStats.map(async (rivalStat) => {
        const hashtagLogs = await this.db_hashtagService.getHashtagLogPosts({hashtag: rivalStat.hashtag, min_timestamp: min_ts, max_timestamp: max_ts})
        const averageBySlicesLogs = this.averageBySlicesLogs(hashtagLogs)
        const hashtagRivalStat: ResHashtagRivalsStatsINTF = {
          hashtag: rivalStat.hashtag,
          current_posts: rivalStat.current_posts,
          current_score: rivalStat.current_score,
          current_score_pct: rivalStat.current_score_pct,
          current_magnitude: rivalStat.current_magnitude,
          prev_posts: rivalStat.prev_posts,
          prev_score: rivalStat.prev_score,
          prev_score_pct: rivalStat.prev_score_pct,
          prev_magnitude: rivalStat.prev_magnitude,
          posts_logs: averageBySlicesLogs
        }
        resHashtagRivalsStats.push(hashtagRivalStat)
      }))
      return resHashtagRivalsStats
    }catch(e){ throw e }
  }

  async getHashtagRelationRatio(reqHashtagRelationRatio: ReqHashtagRelationRatioDTO): Promise<IResHashtagRelationRatio> {
    const { hashtag, min_date, limit } = reqHashtagRelationRatio
    const _min_date = timestampToDate(min_date)
    try{
      const hashtagRelationLogs = await this.db_hashtagService.getHashtagRelationLogs({hashtag: hashtag, min_date: _min_date, limit: limit})
      const resHashtagRelationRatio: IResHashtagRelationRatio = {
        relation_logs: hashtagRelationLogs,
        max: hashtagRelationLogs[0]?.occurrences || null,
        min: hashtagRelationLogs[hashtagRelationLogs.length - 1]?.occurrences || null
      }
      return resHashtagRelationRatio
    }catch(e){
      throw e
    }
  }

  async getLowerHashtagRelationRatio(reqHashtagRelationRatio: ReqHashtagRelationRatioDTO): Promise<ResHashtagRelationLogINTF[]> {
    const { hashtag, min_date, limit } = reqHashtagRelationRatio
    const _min_date = timestampToDate(min_date)
    try{
      const hashtagRelationLogs = await this.db_hashtagService.getLowerHashtagRelationLogs({hashtag: hashtag, min_date: _min_date, limit: limit })
      return hashtagRelationLogs
    }catch(e){
      throw e
    }
  }

  async getLatestHashtagRelation(reqHashtagRelationRatio: ReqHashtagRelationRatioDTO): Promise<IResLatestHashtagRelation[]> {
    const { hashtag, min_date, limit } = reqHashtagRelationRatio
    const _min_date = timestampToDate(min_date)
    try{
      const hashtagRelationLogs = await this.db_hashtagService.getLatestHashtagRelations({hashtag: hashtag, min_date: _min_date, limit: limit })
      return hashtagRelationLogs
    }catch(e){ throw e }
  }

  async getSummaryStats(reqSummaryStats: ReqBasicSearchDTO): Promise<IResSummaryStats> {
    const { hashtag, min_date } = reqSummaryStats
    try{
      const summaryStats = await this.db_hashtagService.getSummaryStats({hashtag: hashtag, min_timestamp: min_date})
      summaryStats.stats_logs = this.normalizeStatsLogs(summaryStats.stats_logs)
      return summaryStats
    }catch(e){
      throw e
    }
  }

  async getSentimentScore(reqSummaryStats: ReqBasicSearchDTO): Promise<IResSentimentScore> {
    const { hashtag, min_date, _profile_id } = reqSummaryStats
    try{
      const rawAllPostsSentimentScore = await this.db_hashtagService.getSentimentScore({hashtag: hashtag, allTypeOfPosts: true, min_timestamp: min_date})
      const rawTopPostsSentimentScore = await this.db_hashtagService.getSentimentScore({hashtag: hashtag, min_timestamp: min_date})
      const rawTaggedPostsSentimentScore = await this.db_profileService.getSentimentScoreTaggedPosts({_profile_id: _profile_id, min_date: min_date})

      const allPostsSentimentScore = this.roundSentimentValues({sentimentScores: rawAllPostsSentimentScore, decimals: 2})
      const topPostsSentimentScore = this.roundSentimentValues({sentimentScores: rawTopPostsSentimentScore, decimals: 2})
      const taggedPostsSentimentScore = this.roundSentimentValues({sentimentScores: rawTaggedPostsSentimentScore, decimals: 2})

      const allPostList = await this.db_hashtagService.getClassifiedAllPosts({hashtag: hashtag, allTypeOfPosts: true, min_timestamp: min_date})
      const topPostList = await this.db_hashtagService.getClassifiedTopPosts({hashtag: hashtag, min_timestamp: min_date})
      const taggedPostList = await this.db_hashtagService.getClassifiedTaggedPosts({_profile_id: _profile_id, min_date: min_date})

      allPostsSentimentScore.positives.postList = allPostList.positives;
      allPostsSentimentScore.negatives.postList = allPostList.negatives;
      allPostsSentimentScore.neutrals.postList = allPostList.neutrals;

      topPostsSentimentScore.positives.postList = topPostList.positives;
      topPostsSentimentScore.negatives.postList = topPostList.negatives;
      topPostsSentimentScore.neutrals.postList = topPostList.neutrals;

      taggedPostsSentimentScore.positives.postList = taggedPostList.positives;
      taggedPostsSentimentScore.negatives.postList = taggedPostList.negatives;
      taggedPostsSentimentScore.neutrals.postList = taggedPostList.neutrals;

      const resPostsSentimentScore: IResSentimentScore = {
        allPosts: allPostsSentimentScore,
        topPosts: topPostsSentimentScore,
        taggedPosts: taggedPostsSentimentScore
      }
      return resPostsSentimentScore
    }catch(e){ throw e }
  }

  
  async getHashtagRivals(params: {hashtag: string}): Promise<IResHashtagRival[]> {
    try{
      const popularPosts = await this.db_hashtagService.getHashtagRivals({hashtag: params.hashtag})
      return popularPosts
    }catch(e){
      throw e
    }
  }

  async createHashtagRival(createHashtagRival: CreateHashtagRivalDTO): Promise<void>{
    try{
      await this.db_hashtagService.createHashtagRival(createHashtagRival)
    }catch(e){
      throw e
    }
  }

  async getMaxMinSentiments(hashtag: string, _profile_id: string): Promise<ResLimitsSentiment>{
    try{
      const limitsHashtag = await this.db_hashtagService.getMaxMinSentiments({hashtag: hashtag})
      const limitsTagged = await this.db_profileService.getMaxMinSentimentsTaggedPosts({_profile_id: _profile_id})

      const limits: ResLimitsSentiment = limitsHashtag;

      if(limitsHashtag.score.max < limitsTagged.score.max){
        limits.score.max = limitsTagged.score.max
      }

      if(limitsHashtag.magnitude.max < limitsTagged.magnitude.max){
        limits.magnitude.max = limitsTagged.magnitude.max
      }

      if(limitsHashtag.score.min > limitsTagged.score.min){
        limits.score.min = limitsTagged.score.min
      }

      if(limitsHashtag.magnitude.min > limitsTagged.magnitude.min){
        limits.magnitude.min = limitsTagged.magnitude.min
      }

      return limits
    }catch(err) { throw err}
  }

  //************************************************************************************************/
  //********************************  PRIVATE FUNCTIONS  ******************************************/

  private averageBySlicesLogs(posts_logs: number[]): number[]{
    const averages = []
    const groupsNumber = Math.ceil(posts_logs.length/Dashboard.RIVALS.GRAPH_POINTS)
    if(groupsNumber > 1){
      for(let i=0; i<Dashboard.RIVALS.GRAPH_POINTS && posts_logs.length > 0; i++){
        const logs = posts_logs.splice(0, groupsNumber)
        const sum = logs.reduce(function(a, b) { return a + b; }, 0);
        const avg = sum/logs.length
        averages.push(avg)
      }
      return averages
    }
    return posts_logs
  }

  private normalizeStatsLogs(stats_logs: IResStats[]): IResStats[]{
    if(!stats_logs) return []
    
    const averages: IResStats[] = []
    const daysByGroup = Math.ceil(stats_logs.length/Dashboard.STATS.GRAPH_POINTS)
    if(daysByGroup > 1){
      for(let i=0; i<Dashboard.STATS.GRAPH_POINTS && stats_logs.length > 0; i++){
        const logs = stats_logs.splice(0, daysByGroup)
        const middleLog = logs[Math.floor(logs.length/2)]
        averages.push(middleLog)
      }
      return averages
    }
    return stats_logs
  }

  private roundSentimentValues(params: {sentimentScores: IResPostsSentimentScore, decimals: number}): IResPostsSentimentScore {
    const {sentimentScores, decimals} = params
    const resSentimentScore: IResPostsSentimentScore = {
      score: roundDecimal({number: sentimentScores?.score, decimals: decimals}),
      magnitude: roundDecimal({number: sentimentScores?.magnitude, decimals: decimals}),
      posts: roundDecimal({number: sentimentScores?.posts, decimals: decimals}),
      positives: {
        posts: roundDecimal({number: sentimentScores?.positives?.posts, decimals: decimals}),
        score: roundDecimal({number: sentimentScores?.positives?.score, decimals: decimals}),
        magnitude: roundDecimal({number: sentimentScores?.positives?.magnitude, decimals: decimals})
      },
      negatives: {
        posts: roundDecimal({number: sentimentScores?.negatives?.posts, decimals: decimals}),
        score: roundDecimal({number: sentimentScores?.negatives?.score, decimals: decimals}),
        magnitude: roundDecimal({number: sentimentScores?.negatives?.magnitude, decimals: decimals})
      },
      neutrals: {}
    }
    return resSentimentScore
  }
}