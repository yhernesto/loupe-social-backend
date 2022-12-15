import { Injectable } from '@nestjs/common';
import { db_ProfileService } from 'src/shared/modules/database/db_profile.service';
import { ProfileINTF } from './interfaces/Profile.intf';
import { ProfileStatsLogINTF } from 'src/shared/modules/database/interfaces/Profile/ProfileStatsLog.intf'
import { IProfileStats } from './interfaces/ResProfileStats.intf';
import { ReqProfileINTF } from './interfaces/ReqProfile.dto';
import { ReqProfileSummaryStatsINTF } from './interfaces/ReqProfileSummaryStats.dto';
import { ILight_profile, IResProfileSummaryStats } from './interfaces/ResProfileSummaryStats.intf';
import { roundDecimal, timestampToDate } from 'src/shared/utils/Utils';
import { ReqBasicSearchDTO } from './interfaces/ReqBasicSearch.dto';
import { ResBestTimeToPostINTF } from './interfaces/ResBestTimeToPost.intf';
import { ResTopTimeToPostINTF } from './interfaces/ResTopTimeToPost.intf';
import { ResTextAvgStats, ResTextStatsINTF, TextAvgStats } from './interfaces/ResTextStats.intf';
import { ResStatsProgressByWeekDay } from './interfaces/ResStatsProgressByWeekDay.intf';
import { MappedHashtagStats, ResHashtagStatsINTF, TextStats } from './interfaces/ResHashtagStats.intf';
import { IResPostsSentimentScore } from '../hashtag/interfaces/dashboard/ResSentimentScore.intf';
import { IResCommentsSentimentScore } from './interfaces/ResCommentSentimentScore.int';
import { IResTaggedStats } from './interfaces/ResTaggedStats.int';
import { Dashboard } from 'src/shared/constants/instagram.constants';
import { IResSummaryStats } from './interfaces/ResTaggedSummaryStats.int';

@Injectable()
export class ProfileService {
  constructor(private db_profileService: db_ProfileService){}

  async getProfileByIGId(param: {profile_ig_id: number}): Promise<ProfileINTF>{
    try {
      return await this.db_profileService.findProfile({profile_id: param.profile_ig_id})
    } catch (error) {
      throw error
    }
  }

  async getLastProfileStats(repProfileId: ReqProfileINTF): Promise<IProfileStats>{
    try{
      const lastStats: ProfileStatsLogINTF = await this.db_profileService.getProfileLastStats({profile_ig_id: repProfileId.profile_ig_id})
      return lastStats ? { 
        media: lastStats.media_count,
        following: lastStats.following_count,
        followers: lastStats.follower_count,
        igtvs:  lastStats.total_igtv_videos,
        tags: lastStats.usertags_count,
        arEffects: lastStats.total_ar_effects,
        stories: lastStats.total_clips_count
      } : null
    }catch(error){
      throw error
    }
  }


  async getProfileStats(params: {profile: ProfileINTF, min_date: number}): Promise<IProfileStats>{
    try{
      const { profile, min_date } = params
      const recentPeriodStats = await this.db_profileService.getProfileAvgStats({profile: profile, min_date: min_date})
      return recentPeriodStats || {} as IProfileStats
    }catch(error){ throw error }
  }

  async getProfileStatsSummary(reqAvgSummaryStats: ReqProfileSummaryStatsINTF): Promise<IResProfileSummaryStats>{
    try{
      const { profile_ig_id, prev_per_min_date , post_per_min_date} = reqAvgSummaryStats

      const profile: ProfileINTF = await this.getProfileByIGId({profile_ig_id: Number(profile_ig_id)})
      if(profile){
        const { username, full_name, biography, profile_pic, is_verified } = profile
        const light_profile: ILight_profile = {username, full_name, biography, profile_pic, is_verified}
        
        const currentStats: IProfileStats = { 
          media: profile.media_count,
          following: profile.following_count,
          followers: profile.follower_count,
          igtvs:  profile.total_igtv_videos,
          tags: profile.usertags_count,
          arEffects: profile.total_ar_effects,
          stories: profile.total_clips_count
        }

        const prevPeriodAvgStats = await this.getProfileStats({profile: profile, min_date: prev_per_min_date})
        const currentPeriodAvgStats = await this.getProfileStats({profile: profile, min_date: post_per_min_date})

        return {
          profile: light_profile,
          current_stats: currentStats,
          prev_period_stats: prevPeriodAvgStats,
          post_period_stats: currentPeriodAvgStats
        }
      }
      throw new Error('profile id: ' + profile_ig_id + " doesn't exists")
    }catch(e){ throw e }
  }

  async getBestTimeToPost(reqBestTimeToPostDTO: ReqBasicSearchDTO): Promise<ResBestTimeToPostINTF>{
    const { _profile_id, min_date } = reqBestTimeToPostDTO
    const _min_date = timestampToDate(min_date)
    try{
      const bestTimeToPost = await this.db_profileService.getBestTimeToPost({_profile_id: _profile_id, min_date: _min_date})
      return bestTimeToPost
    }catch(error){
      throw error
    }
  }

  async getTopTimeToPost(reqBestTimeToPostDTO: ReqBasicSearchDTO): Promise<ResTopTimeToPostINTF>{
    const { _profile_id, min_date } = reqBestTimeToPostDTO
    const _min_date = timestampToDate(min_date)
    try{
      const bestTimeToPost = await this.db_profileService.getTopTimeToPost({_profile_id: _profile_id, min_date: _min_date})
      return bestTimeToPost || {} as ResTopTimeToPostINTF
    }catch(error){
      throw error
    }
  }

  async getHashtagStats(reqHashtagStatsDTO: ReqBasicSearchDTO): Promise<ResHashtagStatsINTF[]>{
    const { _profile_id, min_date } = reqHashtagStatsDTO
    try{
      const textStats = await this.db_profileService.getTextStats({_profile_id: _profile_id, min_date: min_date})
      const resHashtagStats = this.getMappedHashtagStats(textStats)
      return resHashtagStats || [] as ResHashtagStatsINTF[]
    }catch(error){
      throw error
    }
  }

  async getPostTextStats(reqNumberOfHashtagStats: ReqBasicSearchDTO): Promise<ResTextStatsINTF>{
    const { _profile_id, min_date } = reqNumberOfHashtagStats
    try{
      const textStats = await this.db_profileService.getTextStats({_profile_id: _profile_id, min_date: min_date})
      const numberOfHashtagsStats = this.getHashtagUsesDistribution(textStats)
      const postLengthStats = this.getPostLengthDistribution(textStats)
      const resTextStats: ResTextStatsINTF = {
        numberOfHashtagStats: numberOfHashtagsStats,
        postsLengthStats: postLengthStats
      }
      return resTextStats
    }catch(error){
      throw error
    }
  } 
  
  async getStatsProgressByWeekDay(reqStatsProgress: ReqBasicSearchDTO): Promise<ResStatsProgressByWeekDay[]>{
    const { _profile_id, min_date } = reqStatsProgress
    try{
      const resStatsProgress = await this.db_profileService.getStatsProgressByWeekDay({_profile_id: _profile_id, min_date: min_date})
      return resStatsProgress
    }catch(error){
      throw error
    }
  }

  async getSentimentScore(reqSentimentScore: ReqBasicSearchDTO): Promise<IResCommentsSentimentScore>{
    try{
      const rawCommentsSentimentScore = await this.db_profileService.getSentimentScoreComments(reqSentimentScore)
      const commentsSentimentScore = this.roundSentimentValues({sentimentScores: rawCommentsSentimentScore, decimals: 2})

      const commentsPostList = await this.db_profileService.getClassifiedComments(reqSentimentScore)

      commentsSentimentScore.positives.postList = commentsPostList.positives
      commentsSentimentScore.negatives.postList = commentsPostList.negatives
      commentsSentimentScore.neutrals.postList = commentsPostList.neutrals

      const resCommentsSentimentScore: IResCommentsSentimentScore = {
        allComments: commentsSentimentScore
      }

      return resCommentsSentimentScore;
    }catch(error){throw error}
  }

  async getSummaryStats(reqSummaryStats: ReqBasicSearchDTO): Promise<IResSummaryStats> {
    const { _profile_id, min_date } = reqSummaryStats
    try{
      const summaryStats = await this.db_profileService.getTaggedSummaryStats({_profile_id: _profile_id, min_date: min_date})
      summaryStats.stats_logs = this.normalizeStatsLogs(summaryStats.stats_logs)
      return summaryStats
    }catch(e){ throw e }
  }

  // *********************************************************************************
  // ********************************* PRIVATE FUNCTIONS *****************************

  private getMappedHashtagStats(textsStats: TextStats[]): ResHashtagStatsINTF[]{
    const mappedHashtagStats = new Map<string, MappedHashtagStats>()
    textsStats.forEach(textStats => {
      if(textStats.text){
        const hashtags = this.getHashtagInsideText(textStats.text)
        hashtags.forEach(hashtag => {
          const updatedHashtagStat = this.getStatsUpdated({map: mappedHashtagStats, sourceToUpdate: textStats, key: hashtag})
          mappedHashtagStats.set(hashtag, updatedHashtagStat)
        })
      }
    })
    return this.mappedHashtagsToResHashtag(mappedHashtagStats)
  }


  private mappedHashtagsToResHashtag(mappedHashtags: Map<string, MappedHashtagStats>): ResHashtagStatsINTF[]{
    const hashtagStats: ResHashtagStatsINTF[] = []
    mappedHashtags.forEach(async (stat, hashtag) => {
      const hashtagStat = {
        hashtag: hashtag,
        avgLikes: roundDecimal({number: (stat.avgLikes/stat.times), decimals: 2}),
        avgComments: roundDecimal({number: (stat.avgComments/stat.times), decimals: 2}),
      }
      hashtagStats.push(hashtagStat)
    })
    return hashtagStats
  }

  private getHashtagUsesDistribution(textsStats: TextStats[]): ResTextAvgStats[]{
    const mappedNumberHashtags = new Map<string, TextAvgStats>()
    textsStats.forEach(textStats => {
      if(textStats.text){
        const hashtags = this.getHashtagInsideText(textStats.text)
        if(hashtags.length <= 1){
          const hashtagStatsUpdated = this.getStatsUpdated({map: mappedNumberHashtags, sourceToUpdate: textStats, key: '0-1'})
          mappedNumberHashtags.set('0-1', hashtagStatsUpdated)
        }else if (2 <= hashtags.length && hashtags.length <= 5){
          const hashtagStatsUpdated = this.getStatsUpdated({map: mappedNumberHashtags, sourceToUpdate: textStats, key: '2-5'})
          mappedNumberHashtags.set('2-5', hashtagStatsUpdated)
        }else if (6 <= hashtags.length && hashtags.length <= 10){
          const hashtagStatsUpdated = this.getStatsUpdated({map: mappedNumberHashtags, sourceToUpdate: textStats, key: '6-10'})
          mappedNumberHashtags.set('6-10', hashtagStatsUpdated)
        }else {
          const hashtagStatsUpdated = this.getStatsUpdated({map: mappedNumberHashtags, sourceToUpdate: textStats, key: '11-'})
          mappedNumberHashtags.set('11-', hashtagStatsUpdated)
        }
      }
    })
    return this.mappedHashtagsToResNumberHashtags(mappedNumberHashtags)
  }

  private getPostLengthDistribution(textsStats: TextStats[]): ResTextAvgStats[]{
    const mappedPostsLength = new Map<string, TextAvgStats>()
    textsStats.forEach(textStats => {
      const textLength = textStats.text.length
      if(textLength <= 140){
        const hashtagStatsUpdated = this.getStatsUpdated({map: mappedPostsLength, sourceToUpdate: textStats, key: '0-140'})
        mappedPostsLength.set('0-140', hashtagStatsUpdated)
      }else if (141 <= textLength && textLength <= 200){
        const hashtagStatsUpdated = this.getStatsUpdated({map: mappedPostsLength, sourceToUpdate: textStats, key: '141-200'})
        mappedPostsLength.set('141-200', hashtagStatsUpdated)
      }else if (201 <= textLength && textLength <= 300){
        const hashtagStatsUpdated = this.getStatsUpdated({map: mappedPostsLength, sourceToUpdate: textStats, key: '201-300'})
        mappedPostsLength.set('201-300', hashtagStatsUpdated)
      }else {
        const hashtagStatsUpdated = this.getStatsUpdated({map: mappedPostsLength, sourceToUpdate: textStats, key: '301-'})
        mappedPostsLength.set('301-', hashtagStatsUpdated)
      }
    })
    return this.mappedHashtagsToResNumberHashtags(mappedPostsLength)
  }


  private mappedHashtagsToResNumberHashtags(mappedHashtags: Map<string, TextAvgStats>): ResTextAvgStats[]{
    const resNumberOfHashtagsStats: ResTextAvgStats[] = [] 
    mappedHashtags.forEach(async (hashtagStats, range) => {
      const stats: TextAvgStats = {
        avgLikes: roundDecimal({number: (hashtagStats.avgLikes/hashtagStats.times), decimals: 2}),
        avgComments: roundDecimal({number: (hashtagStats.avgComments/hashtagStats.times), decimals: 2}),
        times: hashtagStats.times
      }
      const rangeStats: ResTextAvgStats = {
        range: range,
        stats: stats
      }
      resNumberOfHashtagsStats.push(rangeStats)
    })

    resNumberOfHashtagsStats.sort(function(stat1, stat2) {   //order by range
      const a = Number(stat1.range.split('-')[0])
      const b = Number(stat2.range.split('-')[0])
      return a - b;
    });
    return resNumberOfHashtagsStats
  }

  private getHashtagInsideText(postText: string): string[]{
    const hashtagsInPostText: string[] = []
    let hashtagOccurrences: string[] = []
    const specialCharacters = /^[*?¿@!¡$%&()=+{},;:|-]/   //not add symbols after '-' symbol
    
    postText = postText.trim().replace(/\s+/g, ' ')
    const allWords = postText.split(' ')
    allWords.forEach(word => {
      hashtagOccurrences = word.match(/#/g) || []
      if(hashtagOccurrences.length > 0){
        const hashtagNames = word.split('#')
        hashtagNames.forEach(hashtagName => {
          hashtagName = hashtagName.toLowerCase()
          if(hashtagName.length > 0 && !specialCharacters.test(hashtagName)){
            hashtagsInPostText.push(hashtagName)
          }
        })
      }
    })
    return hashtagsInPostText
  }

  private getStatsUpdated(params: {map: Map<string, TextAvgStats>, key: string, sourceToUpdate: TextStats}): any {
    const {map: mappedHashtags, key, sourceToUpdate: statsToUpdate} = params
    let addedLikes, addedComments, incrementedTimes
    const hashtagsStats = mappedHashtags.get(key)
    if(hashtagsStats){
      addedLikes = hashtagsStats.avgLikes + statsToUpdate.likes
      addedComments = hashtagsStats.avgComments + statsToUpdate.comments
      incrementedTimes = hashtagsStats.times + 1
    }
    const newHashtagStat: TextAvgStats = {
      avgLikes: addedLikes ?? statsToUpdate.likes,
      avgComments: addedComments ?? statsToUpdate.comments,
      times: incrementedTimes ?? 1
    }
    return newHashtagStat
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
  
  private normalizeStatsLogs(stats_logs: IResTaggedStats[]): IResTaggedStats[]{
    if(!stats_logs) return []
    
    const averages: IResTaggedStats[] = []
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
}
