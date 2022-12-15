import { Injectable } from '@nestjs/common';
import { Ig_HashtagPost, Ig_postDocument } from './schemas/ig-hashtagPost.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IResHashtagPosts } from './interfaces/Hashtag/api/ResPopularPosts.intf'
import { ResHashtagStatsINTF } from './interfaces/Hashtag/api/ResHashtagStats.intf'
import { CreateHashtagPostDTO } from './interfaces/Hashtag/dtos/CreateHashtagPost.dto';
import { IResTopInfluencerLite, IResTopInfluencersNew, ResTopInfluencersINTF } from './interfaces/Hashtag/api/ResTopInfluencers.intf';
import { ReqHashtagPostsDTO, IReqHashtagPosts } from './interfaces/Hashtag/api/ReqPopularPosts.dto';
import { ResHashtagRivalsStatsINTF } from './interfaces/Hashtag/api/ResHashtagRivalsStats.intf';
import { CreateHashtagRivalDTO } from './interfaces/Hashtag/dtos/CreateHashtagRivals.dto';
import { Ig_hashtagRival, Ig_hashtagRivalDocument } from './schemas/ig-hashtagRivals.schema';
import { CreateHashtagDTO } from './interfaces/Hashtag/dtos/CreateHashtag.dto';
import { HashtagRivalINTF } from './interfaces/Hashtag/hashtagRival.intf';
import { Ig_hashtagLogDocument, Ig_hashtagLog } from './schemas/ig-hashtagLog.schema';
import { ReqHashtagLogDTO } from './interfaces/Hashtag/api/ReqHashtagLog.dto';
import { IResLatestHashtagRelation, ResHashtagRelationLogINTF } from './interfaces/Hashtag/api/ResHashtagRelationRatio.intf';
import { Ig_hashtagRelationLog, Ig_hashtagRelationLogDocument } from './schemas/ig-hashtagRelationLog.schema';
import { resSummaryStatsEmpty, ResSummaryStatsINTF } from './interfaces/Hashtag/api/ResSummaryStats.intf';
import { resSentimentScoreEmpty, ResSentimentScoreINTF } from './interfaces/Hashtag/api/ResSentimentScore.intf';
import mongoose from 'mongoose';
import { ReqHashtagRelationRatioDTO, ReqHashtagRelationRatioINTF } from './interfaces/Hashtag/api/ReqHashtagRelationRation.intf';
import { AppLoggerService } from '../app-logger/app-logger.service';
import { Ig_Hashtag, Ig_hashtagDocument } from './schemas/ig-hashtag.schema';
import { CreateHashtagLogDTO } from './interfaces/Hashtag/dtos/CreateHashtagLog.dto';
import { CreateHashtagRelationLogDTO } from './interfaces/Hashtag/dtos/CreateHashtagRelationLog.dto';
import { HashtagPostINTF } from './interfaces/Hashtag/hashtagPost.intf';
import { IReqBasicSearchTS, ReqBasicSearchTSDTO } from './interfaces/Hashtag/api/ReqBasicSearchTS.dto';
import { IReqPostsByProfile, ReqPostsByProfileDTO } from './interfaces/Hashtag/api/ReqPostsByProfile.intf';
import { IPostsByProfile } from './interfaces/Hashtag/api/ResPostsByProfile.intf';
import { asyncForEach } from 'src/shared/utils/Utils';
import { ResLimitsSentiment } from './interfaces/Profile/Api/ResLimitsStats.intf';
import { IReducedPostList } from './interfaces/Hashtag/api/ResReducedPostList.int';
import { IReqBasicSearchTS as IReqBasicSearchProfileTS, ReqBasicSearchTSDTO as ReqBasicSearchProfileTSDTO} from './interfaces/Profile/Api/ReqBasicSearchTS.dto';
import { SCORE_POSTS_LIMIT } from 'src/shared/constants/constants';
import { Ig_tagPost, Ig_tagPostDocument } from './schemas/ig-tagPost.schema';
import { db_ProfileService } from './db_profile.service';

@Injectable()
export class Db_HashtagService {
  private readonly appLogger = new AppLoggerService(Db_HashtagService.name)

  constructor(
    @InjectModel(Ig_Hashtag.name) private ig_hashtagModel: Model<Ig_hashtagDocument>,
    @InjectModel(Ig_hashtagLog.name) private ig_hashtagLogModel: Model<Ig_hashtagLogDocument>,
    @InjectModel(Ig_HashtagPost.name) private ig_hashtagPostModel: Model<Ig_postDocument>,
    @InjectModel(Ig_hashtagRival.name) private ig_hashtagRivalModel: Model<Ig_hashtagRivalDocument>,
    @InjectModel(Ig_hashtagRelationLog.name) private ig_hashtagRelationLogModel: Model<Ig_hashtagRelationLogDocument>,
    @InjectModel(Ig_tagPost.name) private ig_tagPostModel: Model<Ig_tagPostDocument>,
    private db_profileService: db_ProfileService
  ){}

  async getPopularPosts(reqPopularPosts: IReqHashtagPosts): Promise<IResHashtagPosts[]>{
    try{
      const reqPopularPostsDTO = new ReqHashtagPostsDTO(reqPopularPosts)
      const topLimit = parseInt(reqPopularPostsDTO.top)
      const max_magnitude = await this.getMaxMagnitude(reqPopularPostsDTO.hashtag, reqPopularPostsDTO._profile_id)

      const resPopularPosts = await this.ig_hashtagPostModel.aggregate([
        { $match: {
            hashtag: reqPopularPostsDTO.hashtag,
            taken_at_timestamp: { $gte : reqPopularPostsDTO.min_timestamp }
        }}, 
        { $project: {
            _id: false,
            is_top: '$is_top',
            shortcode: '$shortcode',
            score:{ $round: [{ $multiply: ['$text.score', 10]}, 2] },
            magnitude: { $round: [{ $multiply: ['$text.magnitude', 10]}, 2] },
            text: '$text.text',
            likes: '$likes',
            comments: '$comments',
            takenAt: '$taken_at_timestamp'
        }},
        { $addFields: {
            score_pct:{$divide:[{$subtract: ['$score',  -10]}, 20]},
            magnitude_pct:{$divide:['$magnitude', max_magnitude]},
        }},
        { $project: {
            is_top: '$is_top',
            shortcode: '$shortcode',
            score:'$score',
            magnitude: '$magnitude',
            text: '$text',
            likes: '$likes',
            comments: '$comments',
            takenAt: '$takenAt',
            score_pct: {$abs: { $round: ['$score_pct', 2] }},
            magnitude_pct: {$abs: { $round: ['$magnitude_pct', 2] }}
        }},
        { $sort: { likes: -1 }},
        { $limit: topLimit}
      ])
    
      // hashtag/popularPosts?hashtag=adidasperu&min_date=2021-11-23&max_date=2021-11-29&top=50"
      return resPopularPosts || []
    }catch(e){ throw e }
  }

  async getLatestPosts(reqHashtagPosts: IReqHashtagPosts): Promise<IResHashtagPosts[]>{
    try{
      const reqLatestPostsDTO = new ReqHashtagPostsDTO(reqHashtagPosts)
      const limit = parseInt(reqLatestPostsDTO.top)
      const max_magnitude = await this.getMaxMagnitude(reqLatestPostsDTO.hashtag, reqLatestPostsDTO._profile_id)

      const resLatestPosts = await this.ig_hashtagPostModel.aggregate([
        { $match: {
            hashtag: reqLatestPostsDTO.hashtag,
            taken_at_timestamp: { $gte : reqLatestPostsDTO.min_timestamp }
          }
        },
        { $project: {
          _id: false,
          is_top: '$is_top',
          shortcode: '$shortcode',
          score: { $round: [{ $multiply: ['$text.score', 10]}, 2] },
          magnitude: { $round: [{ $multiply: ['$text.magnitude', 10]}, 2] },
          text: '$text.text',
          likes: '$likes',
          comments: '$comments',
          takenAt: '$taken_at_timestamp'
        }},
        { $addFields: {
          score_pct:{$divide:[{$subtract: ['$score',  -10]}, 20]},
          magnitude_pct:{$divide:['$magnitude', max_magnitude]},
        }},
        { $sort: { takenAt: -1 }},
        { $limit: limit }
      ])
    
      return resLatestPosts || []
    }catch(e){ throw e }
  }

  async getSentimentScore(reqSentimentScoreINTF: IReqBasicSearchTS): Promise<ResSentimentScoreINTF>{
    try{
      const reqSentimentScore = new ReqBasicSearchTSDTO(reqSentimentScoreINTF)
      let matchQuery
      if(reqSentimentScore.allTypeOfPosts){
        matchQuery = {
          hashtag: reqSentimentScore.hashtag,
          "text.score": {'$exists': true},
          taken_at_timestamp: { $gte : reqSentimentScore.min_timestamp },
        }
      }else{
        const minDate = new Date(reqSentimentScore.min_timestamp*1000)
        matchQuery = {
          hashtag: reqSentimentScore.hashtag,
          "text.score": {'$exists': true},
          is_top: true,
          updatedAt: { $gte : new Date(minDate) },
        }
      }

      const resSentimentScore = await this.ig_hashtagPostModel.aggregate([
        { $match: matchQuery},
        { $group: {
          _id: '$hashtag',
          score: {'$avg': "$text.score"},
          magnitude: {'$avg': "$text.magnitude"},
          posts:{$sum:1},
          pos: {$push: {
                "$cond":[
                        {"$gte":["$text.score", 0.25]},
                        {'score': "$text.score", 'magnitude': "$text.magnitude", "count": 1},
                        null
                    ]
              }
          },
          neg: {$push: {
              "$cond":[
                      {"$lte":["$text.score", -0.25]},
                      {'score': "$text.score", 'magnitude': "$text.magnitude", "count": 1},
                      null
                  ]
            }
          }
        }}, 
        { $project: {
          _id: false,
          score: {$multiply: ['$score', 10]},
          magnitude: {$multiply: ['$magnitude', 10]},
          posts: "$posts",
          positives: {
            posts:{$sum:"$pos.count"},
            score: {$multiply: [{'$avg': "$pos.score"}, 10]},
            magnitude: {$multiply: [{'$avg': "$pos.magnitude"}, 10]}
          },
          negatives: {
            posts:{$sum:"$neg.count"},
            score: {$multiply: [{'$avg': "$neg.score"}, 10]},
            magnitude: {$multiply: [{'$avg': "$neg.magnitude"}, 10]}
          }
        }}
      ])

      return resSentimentScore[0] || resSentimentScoreEmpty
    }catch(e){ throw e }
  }

  async getClassifiedAllPosts(IReqClassifiedPosts: IReqBasicSearchTS): Promise<IReducedPostList> {
    try {
      const reqClassifiedPosts = new ReqBasicSearchTSDTO(IReqClassifiedPosts)

      const resClassifiedAllPosts = await this.ig_hashtagPostModel.aggregate([
        { $match: {
          hashtag: reqClassifiedPosts.hashtag,
          "text.score": {'$exists': true},
          taken_at_timestamp: { $gte : reqClassifiedPosts.min_timestamp },
        }},
        { $sort: {taken_at_timestamp: -1} },
        { $group: {
          _id: '$hashtag',
          pos: {$push:
            {
              "$cond":[
                {"$gte":["$text.score", 0.25]},
                {'text': "$text.text",'shortcode': "$shortcode",'takenAt': "$taken_at_timestamp"},
                "$$REMOVE"
              ]
            }
          },
          neg: {$push:
            {
              "$cond":[
                {"$lte":["$text.score", -0.25]},
                {'text': "$text.text",'shortcode': "$shortcode",'takenAt': "$taken_at_timestamp"},
                "$$REMOVE"
              ]
            }
          },
          neu: {$push:
          {
            "$cond":[
              { $and:[
                {"$lte":["$text.score", 0.25]},
                {"$gte":["$text.score", -0.25]}
                ]
              },
              {'text': "$text.text",'shortcode': "$shortcode",'takenAt': "$taken_at_timestamp"},
              "$$REMOVE"
            ]
          }
        },
        }},
        {$project:{
          _id: false,
          positives: {$slice: ["$pos", SCORE_POSTS_LIMIT]},
          negatives: {$slice: ["$neg", SCORE_POSTS_LIMIT]},
          neutrals: {$slice: ["$neu", SCORE_POSTS_LIMIT]},
        }}
      ])

      return resClassifiedAllPosts[0] || []
    }catch(e){ throw e }
  }

  async getClassifiedTopPosts(IReqClassifiedPosts: IReqBasicSearchTS): Promise<IReducedPostList> {
    try {
      const reqClassifiedPosts = new ReqBasicSearchTSDTO(IReqClassifiedPosts)
      const minDate = new Date(reqClassifiedPosts.min_timestamp*1000)

      const resClassifiedTopPosts = await this.ig_hashtagPostModel.aggregate([
        { $match: {
          hashtag: reqClassifiedPosts.hashtag,
          "text.score": {'$exists': true},
          is_top: true,
          updatedAt: { $gte : new Date(minDate) },
        }},
        { $sort: {updatedAt: -1} },
        { $group: {
          _id: '$hashtag',
          pos: {$push:
            {
              "$cond":[
                {"$gte":["$text.score", 0.25]},
                {
                  'text': "$text.text",
                  'shortcode': "$shortcode",
                  'updatedAt': {$toInt:{$divide:[{$subtract: ['$updatedAt', new Date(0)]},1000]}}
                },
                "$$REMOVE"
              ]
            }
          },
          neg: {$push:
            {
              "$cond":[
                {"$lte":["$text.score", -0.25]},
                {
                  'text': "$text.text",
                  'shortcode': "$shortcode",
                  'updatedAt': {$toInt:{$divide:[{$subtract: ['$updatedAt', new Date(0)]},1000]}}
                },
                "$$REMOVE"
              ]
            }
          },
          neu: {$push:
          {
            "$cond":[
              { $and:[
                {"$lte":["$text.score", 0.25]},
                {"$gte":["$text.score", -0.25]}
                ]
              },
              {
                'text': "$text.text",
                'shortcode': "$shortcode",
                'updatedAt': {$toInt:{$divide:[{$subtract: ['$updatedAt', new Date(0)]},1000]}}
              },
              "$$REMOVE"
            ]
          }
        },
        }},
        {$project:{
          _id: false,
          positives: {$slice: ["$pos", SCORE_POSTS_LIMIT]},
          negatives: {$slice: ["$neg", SCORE_POSTS_LIMIT]},
          neutrals: {$slice: ["$neu", SCORE_POSTS_LIMIT]},
        }}
      ])

      return resClassifiedTopPosts[0] || []
    }catch(e){ throw e }
  }

  async getClassifiedTaggedPosts(IReqClassifiedPosts: IReqBasicSearchProfileTS){
    try{
      const reqClassifiedPosts = new ReqBasicSearchProfileTSDTO(IReqClassifiedPosts)

      const resClassifiedTaggedPosts = await this.ig_tagPostModel.aggregate([
        { $match: {
          taken_at: { $gte: reqClassifiedPosts.min_date},
          _profile_id: mongoose.Types.ObjectId(reqClassifiedPosts._profile_id)
        }},
        { $sort: {taken_at: -1} },
        { $group: {
          _id: null,
          pos: {$push: {
            "$cond":[
              {"$gte":["$text.score", 0.25]},
              {'text': "$text.text", 'shortcode': "$shortcode", "takenAt": "$taken_at"},
              "$$REMOVE"]
          }},
          neg: {$push: {
            "$cond":[
              {"$lte":["$text.score", -0.25]},
              {'text': "$text.text", 'shortcode': "$shortcode", "takenAt": "$taken_at"},
              "$$REMOVE"]
          }},
          neu: {$push: {
            "$cond":[
              { $and:[
                {"$lte":["$text.score", 0.25]},
                {"$gte":["$text.score", -0.25]}
                ]
              },
              {'text': "$text.text", 'shortcode': "$shortcode", "takenAt": "$taken_at"},
              "$$REMOVE"]
          }}
        }},
        {$project:{
          _id: false,
          positives: {$slice: ["$pos", SCORE_POSTS_LIMIT]},
          negatives: {$slice: ["$neg", SCORE_POSTS_LIMIT]},
          neutrals: {$slice: ["$neu", SCORE_POSTS_LIMIT]},
        }}
      ])

      return resClassifiedTaggedPosts[0] || []
    }catch(e){ throw e }
  }

  async getSummaryStats(reqHashtagStats: IReqBasicSearchTS): Promise<ResSummaryStatsINTF>{
    try{
      const hashtagStats = new ReqBasicSearchTSDTO(reqHashtagStats)
      const statsLogsByDay = await this.getHashtagStatsByDay(reqHashtagStats)
      const stats = await this.ig_hashtagPostModel.aggregate([
        { $match: {
            hashtag: reqHashtagStats.hashtag,
            taken_at_timestamp: { $gte : hashtagStats.min_timestamp }
        }}, 
        { $group: {
          _id: '$hashtag', 
          likes: { $sum: "$likes" },
          comments: { $sum: "$comments" },
          posts: { $sum: 1 },
          unique_profiles: {'$addToSet': '$account_id'}
        }},
        { $project: {
          likes: '$likes',
          comments: '$comments',
          posts: '$posts',
          unique_profiles: {'$size': '$unique_profiles'},
          _id: false
        }}
      ])

      if(stats[0]){
        const summaryStats: ResSummaryStatsINTF = {
          likes: stats[0].likes || 0,
          comments: stats[0].comments || 0,
          posts: stats[0].posts || 0,
          unique_profiles: stats[0].unique_profiles || 0,
          stats_logs: statsLogsByDay
        }
        return summaryStats
      }else{
        return resSummaryStatsEmpty
      }
    }catch(e){
      throw e
    }
  }

  async getHashtagStatsByDay(reqHashtagStats: IReqBasicSearchTS): Promise<ResHashtagStatsINTF[]>{
    try{
      const hashtagStats = new ReqBasicSearchTSDTO(reqHashtagStats)
      const hashtag_stats = await this.ig_hashtagPostModel.aggregate([
        { $addFields: {
          'takenDate': { $toDate: { $multiply: ['$taken_at_timestamp', 1000] }}
        }},
        { $match: {
            hashtag: reqHashtagStats.hashtag,
            taken_at_timestamp: { $gte : hashtagStats.min_timestamp }
        }},
        { $group : {
            _id: { 
              '$dateToString': { format: "%Y-%m-%d", date: "$takenDate" }
            },
            likes: { $sum: "$likes" },
            comments: { $sum: "$comments" },
            unique_profiles: {'$addToSet': '$account_id'},
            posts: { $sum: 1 },
        }},
        { $sort: { _id: +1 }},
        { $project: {
            _id: false,
            time: '$_id',
            likes: '$likes',
            comments: '$comments',
            unique_profiles: {'$size': '$unique_profiles'},
            posts: '$posts',
        }}
      ])
  
      return hashtag_stats || []
    }catch(e){ throw e }
  }

  async getPostsByInfluencer(reqPostsByProfileINTF: IReqPostsByProfile): Promise<IPostsByProfile[]>{
    try{
      const reqPostsByProfileDTO = new ReqPostsByProfileDTO(reqPostsByProfileINTF)
      const resPostsByProfile = await this.ig_hashtagPostModel.aggregate([
        { $match: {
            hashtag: reqPostsByProfileDTO.hashtag,
            account_id: reqPostsByProfileDTO.profile_ig_id,
            taken_at_timestamp: { $gte : reqPostsByProfileDTO.min_timestamp }
        }},
        { $sort: { taken_at_timestamp: -1 }},
        { $limit: reqPostsByProfileDTO.limit },
        { $project: {
            _id: false,
            shortcode: '$shortcode',
            is_top: '$is_top',
            ig_id: '$_id',
            likes: '$likes',
            comments: '$comments',
            text: '$text.text',
            score: { $round: [{$multiply: ['$text.score', 10]}, 2]},
            magnitude: { $round: [{$multiply: ['$text.magnitude', 10]}, 2]},
            takenDate: '$taken_at_timestamp'
        }}
      ])
      return resPostsByProfile || []
    }catch(e){throw e}
  }

  async getTopInfluencers(reqTopInfluencersINTF: IReqBasicSearchTS): Promise<ResTopInfluencersINTF>{
    try{
      const reqTopInfluencers = new ReqBasicSearchTSDTO(reqTopInfluencersINTF)
      const resTopInfluencers = await this.ig_hashtagPostModel.aggregate([
        {
          $match: {
            hashtag: reqTopInfluencers.hashtag,
            taken_at_timestamp: { $gte : reqTopInfluencers.min_timestamp }
          }
        },
        {
          $group: {
            _id: '$account_id',
            mentions: { $sum: 1 },
            likes: { $sum: '$likes' },
            comments: { $sum: '$comments'},
            score: {$avg: '$text.score'}
          }
        },
        // {
        //   $match: {
        //     likes: { '$gt': 5 },
        //     comments: { '$gt': 5 },
        //     mentions: { '$gt': 5 }
        //   }
        // },
        // {
        //   $sort: { 'mentions': -1 }
        // },
        {
          $lookup: {
            from: 'ig_profiles',
            localField: '_id',
            foreignField: 'ig_id',
            as: 'profile'
          }
        },
        { $unwind: { path: '$profile' } },
        {
          $project: {
            _id: false,
            _profile_id: '$profile._id',
            ig_id: '$profile.ig_id',
            username: '$profile.username',
            full_name: '$profile.full_name',
            biography: '$profile.biography',
            profile_pic_url: '$profile.profile_pic_url',
            is_verified: '$profile.is_verified',
            posts: '$profile.media_count',
            followers: '$profile.follower_count',
            likesByHashtag: '$likes',
            commentsByHashtag: '$comments',
            hashtagMentions: '$mentions',
            score: { $round: [{$multiply: ['$score', 10]}, 2]}
          }
        },
        {
          $facet: {
            byHashtag: [
              {$sort: {'hashtagMentions': -1 }}, {$limit: 50}
            ],
            byLikes: [
              {$sort: {'likesByHashtag': -1 }}, {$limit: 50}
            ],
            byComments: [
              {$sort: {'commentsByHashtag': -1 }}, {$limit: 50}
            ]
          }
        }
      ])

      return resTopInfluencers[0] || {} as ResTopInfluencersINTF
    }catch(e){ throw e }
  }
  
  async getTopInfluencersNew(reqTopInfluencersINTF: IReqBasicSearchTS): Promise<IResTopInfluencersNew[]>{
    try{
      const reqTopInfluencers = new ReqBasicSearchTSDTO(reqTopInfluencersINTF)
      const resTopInfluencers = await this.ig_hashtagPostModel.aggregate([
        { $match: {
            hashtag: reqTopInfluencers.hashtag,
            taken_at_timestamp: { $gte : reqTopInfluencers.min_timestamp}
        }}, 
        { $group: {
            _id: '$account_id',
            mentions: { $sum: 1 },
            likes: {$sum: '$likes'},
            comments: {$sum: '$comments'},
            score: {$avg: '$text.score'}
        }},
        { $lookup: {
            from: 'ig_profiles',
            localField: '_id',
            foreignField: 'ig_id',
            as: 'profile'
        }}, 
        { $unwind: { path: '$profile' }},
        { $project: {
            _id: false,
            ig_id: '$profile.ig_id',
            username: '$profile.username',
            full_name: '$profile.full_name',
            biography: '$profile.biography',
            profile_pic_url: '$profile.profile_pic_url',
            is_verified: '$profile.is_verified',
            followers: '$profile.follower_count',
            posts: '$profile.media_count',
            likesByHashtag: '$likes',
            commentsByHashtag: '$comments',
            hashtagMentions: '$mentions',
            scoreByHashtag: { $round: [{$multiply: ['$score', 10]}, 2]},
            score_pct: {$abs: { $round: [{ $divide: [{ $subtract: ['$score', -1] }, 2] }, 2] }}
        }},
        { $sort: { likesByHashtag: -1 }},
        { $limit: 50 }
      ])

      return resTopInfluencers || []
    }catch(e){ throw e }
  }

  async getTopInfluencersLite(reqTopInfluencersLiteINTF: IReqBasicSearchTS): Promise<IResTopInfluencerLite[]>{
    try{
      const reqTopInfluencersLite = new ReqBasicSearchTSDTO(reqTopInfluencersLiteINTF)
      const resTopInfluencersLite = await this.ig_hashtagPostModel.aggregate([
        {
          $match: {
            hashtag: reqTopInfluencersLite.hashtag,
            taken_at_timestamp: { $gte : reqTopInfluencersLite.min_timestamp }
          }
        }, 
        { $group: {
          _id: '$account_id',
          mentions: { $sum: 1 }
        }}, 
        { $lookup: {
            from: 'ig_profiles',
            localField: '_id',
            foreignField: 'ig_id',
            as: 'profile'
        }}, 
        { $unwind: { path: '$profile' }}, 
        { $project: {
          _id: false,
          _profile_id: '$profile._id',
          ig_id: '$profile.ig_id',
          username: '$profile.username',
          full_name: '$profile.full_name',
          profile_pic_url: '$profile.profile_pic_url',
          is_verified: '$profile.is_verified',
          posts: '$profile.media_count',
          followers: '$profile.follower_count',
          postsUsingHashtag: '$mentions'
        }}, 
        { $sort: { 'postsUsingHashtag': -1 }},
        { $limit: 10 }
      ])

      return resTopInfluencersLite || []
    }catch(e){
      throw e
    }
  }

  
  async getHashtagRivals(params: {hashtag: string}): Promise<HashtagRivalINTF[]>{
    try{
      const resHashtagRivals = await this.ig_hashtagRivalModel.aggregate([
        {
          $match: {
            hashtag: params.hashtag,
            active: true
          }
        },
        { $project: { 
          rival: '$rival',
          active: '$active',
          createdAt: '$createdAt', 
          _id:false } 
        }
      ])

      return resHashtagRivals || []
    }catch(e){
      throw e
    }
  } 

  async getHashtagRivalsStats(reqHashtagRivals: IReqBasicSearchTS): Promise<ResHashtagRivalsStatsINTF[]>{
    try{
      const {min_timestamp: min_ts, max_timestamp: max_ts} = reqHashtagRivals
      const min_previous_period = min_ts - (max_ts - min_ts)
      
      const hashtagRivals = await this.getHashtagRivals(reqHashtagRivals)
      const rivalsHashtagNames = hashtagRivals.map(hashtagRival => {return hashtagRival.rival.hashtag})
      const resHashtagRivals = await this.ig_hashtagPostModel.aggregate([
        { $match: {
            hashtag: { $in: rivalsHashtagNames },
            taken_at_timestamp: { $gte : min_previous_period }
        }},
        { $group: {
            _id: '$hashtag',
            current: { $push: {     //current period
              "$cond": [
                  {"$gte": ["$taken_at_timestamp", min_ts ]},
                  { 'score': "$text.score",'magnitude': "$text.magnitude", 'count': 1},
                  null
                ]
            }},
            prev: { $push: {        //previous period
            "$cond": [
                {"$lt": ["$taken_at_timestamp", min_ts ]},
                { 'score': "$text.score",'magnitude': "$text.magnitude", 'count': 1},
                null
              ]
            }}
        }},
        { $project: {
            hashtag: '$_id',
            current_posts:{$sum:"$current.count"},
            prev_posts:{$sum:"$prev.count"},
            current_score: {$round: [{$multiply: [{'$avg': "$current.score"}, 10]}, 2]},
            current_magnitude: {$round: [{$multiply: [{'$avg': "$current.magnitude"}, 10]}, 2]},
            prev_score: {$round: [{$multiply: [{'$avg': "$prev.score"}, 10]}, 2]},
            prev_magnitude: {$round: [{$multiply: [{'$avg': "$prev.magnitude"}, 10]}, 2]},
            _id: false
        }},
        { $addFields: {
            current_score_pct: { $divide: [{ $subtract: ['$current_score', -10] }, 20] },
            prev_score_pct: { $divide: [{ $subtract: ['$prev_score', -10] }, 20] }
        }
      }
      ])
      return resHashtagRivals || []
    }catch(e){ throw e }
  }

  async getHashtagLogPosts(reqHashtagLog: ReqHashtagLogDTO): Promise<number[]>{
    let {min_timestamp: min_ts, max_timestamp: max_ts} = reqHashtagLog
    min_ts = min_ts * 1000  // to milliseconds
    max_ts = max_ts * 1000  // to milliseconds

    let matchQuery = {}
    if(reqHashtagLog.max_timestamp){
      matchQuery = {
        hashtag: reqHashtagLog.hashtag,
        timestamp: {
          $gte : min_ts
        }
      }
    }else{
      matchQuery = {
        hashtag: reqHashtagLog.hashtag,
        timestamp: {
          $gte : min_ts
        }
      }
    }
    try{
      const resHashtagLog = await this.ig_hashtagLogModel.aggregate([
        { $addFields: {
          'timestamp': { $toLong: '$createdAt' }
        }},
        { $match: matchQuery },
        { $sort: { timestamp: +1 }}, 
        { $group: {
            _id: null, 
            posts: { $push: '$posts' }
        }}, 
        { $project: { _id: false, posts: '$posts' }}
      ])
      return resHashtagLog[0]?.posts || []
    }catch(e){ throw e }
  }
  
  async getHashtagRelationLogs(reqHashtagRelationRatio: ReqHashtagRelationRatioINTF): Promise<ResHashtagRelationLogINTF[]>{
    const reqRelationRatio = new ReqHashtagRelationRatioDTO(reqHashtagRelationRatio)
    const limit = Number(reqRelationRatio.limit)
    try{
      const resHashtagRelationLogs = await this.ig_hashtagRelationLogModel.aggregate([
        {$match: {
          parent: reqRelationRatio.hashtag,
          createdAt: {
            $gt : new Date(reqRelationRatio.min_date)
          }
        }},
        {$project: {
          parent: '$parent',
          relations: {
            $filter: {
              input: "$relations",
              as: "relation",
              cond: {
                '$and': [
                  {$gt: [ "$$relation.occurrences", 1 ]},
                  {$ne: [ "$$relation.child", reqRelationRatio.hashtag]}
                ]
              }
            }
         }
        }}, 
        {$group: {
          _id: '$parent', data: { '$push': "$relations" }}
        }, 
        {$project: {
          "data": {
              "$reduce": {
                  "input": "$data",
                  "initialValue": [],
                  "in": { $concatArrays: [ "$$value", "$$this" ] }
              }
          }
        }}, 
        {$unwind: { path: '$data'}}, 
        {$group: {
          _id: '$data.child',
          total_occurrences: {$sum: '$data.occurrences'}
        }}, 
        {$sort: { total_occurrences: -1 }}, 
        {$limit: limit}, 
        {$project: {
          hashtag: '$_id',
          occurrences: '$total_occurrences',
          _id: false
        }}
      ])

      return resHashtagRelationLogs || []
    }catch(e){ throw e }
  }

  
  async getLowerHashtagRelationLogs(reqHashtagRelationRatio: ReqHashtagRelationRatioINTF): Promise<ResHashtagRelationLogINTF[]>{
    const reqRelationRatio = new ReqHashtagRelationRatioDTO(reqHashtagRelationRatio)
    const limit = Number(reqRelationRatio.limit)
    try{
      const resHashtagRelationLogs = await this.ig_hashtagRelationLogModel.aggregate([
        {$match: {
          parent: reqRelationRatio.hashtag,
          createdAt: { $gt : new Date(reqRelationRatio.min_date) }
        }},
        {$project: {
          parent: '$parent',
          relations: {
            $filter: {
              input: "$relations",
              as: "relation",
              cond: {
                '$and': [
                  {$lte: [ "$$relation.occurrences", 1 ]},
                  {$ne: [ "$$relation.child", reqRelationRatio.hashtag]}
                ]
              }
            }
         }
        }}, 
        {$group: {
          _id: '$parent',
          data: { '$push': "$relations" }
        }}, 
        {$project: {
          "data": {
              "$reduce": {
                  "input": "$data",
                  "initialValue": [],
                  "in": { $concatArrays: [ "$$value", "$$this" ] }
              }
          }
        }}, 
        {$unwind: { path: '$data'}}, 
        {$group: {
          _id: '$data.child',
          total_occurrences: {$sum: '$data.occurrences'}
        }}, 
        {$sort: { total_occurrences: +1 }}, 
        {$limit: limit}, 
        {$project: {
          hashtag: '$_id',
          occurrences: '$total_occurrences',
          _id: false
        }}
      ])

      return resHashtagRelationLogs || []
    }catch(e){ throw e }
  }

  async getLatestHashtagRelations(reqHashtagRelationRatio: ReqHashtagRelationRatioINTF): Promise<IResLatestHashtagRelation[]>{
    const reqRelationRatio = new ReqHashtagRelationRatioDTO(reqHashtagRelationRatio)
    const limit = Number(reqRelationRatio.limit)
    try{
      const resLatestHashtagRelation = await this.ig_hashtagRelationLogModel.aggregate([
        { $match: {
            parent: reqHashtagRelationRatio.hashtag,
            createdAt: { $gt : new Date(reqHashtagRelationRatio.min_date) }
        }}, 
        { $project: {
            hashtags: '$relations',
            createdAt: '$createdAt',
            _id: false
        }},
        { $unwind: { path: '$hashtags' }},
        { $sort: { createdAt: -1 }},
        { $limit: limit },
        { $project: {
            hashtag: '$hashtags.child',
            occurrences: '$hashtags.occurrences',
            takenAt: '$createdAt'
        }}
      ])
      return resLatestHashtagRelation || []
    }catch(e){ throw e }
  }

  async findManyHashtagPosts(shortCodes: string[]): Promise<HashtagPostINTF[]>{
    if(shortCodes?.length > 0){
      try{
        const existingPosts = await this.ig_hashtagPostModel.find({shortcode: {'$in': shortCodes}})
        return existingPosts
      }catch(e){ throw e }
    }
    return []
  }
  
  async getUnanalyzedHashtagPosts(params: {hashtag: string, since_date?: Date, limit: number}): Promise<HashtagPostINTF[]>{
    let queryMatch
    const _since_date: Date | number = params.since_date ?? 0
    if(params.hashtag){
      queryMatch = {
        hashtag: params.hashtag,
        createdAt: { $gte: new Date(_since_date)},
        // is_top: true,
        "text.text": {$ne: ""},
        "text.score": {'$exists': false}
      }
    }else{
      queryMatch = {
        createdAt: { $gte: new Date(_since_date)},
        // is_top: true,
        "text.text": {$ne: ""},
        "text.score": {'$exists': false}
      }
    }
    
    try{
      const resUnanalyzedPosts = await this.ig_hashtagPostModel.aggregate([
        { $match: queryMatch },
        // { $sort: { createdAt: +1 } },
        // { $limit: params.limit}
      ])
      return resUnanalyzedPosts || []
    }catch(e){ throw e }
  }

  async createHashtagRival(createHashtagRival: CreateHashtagRivalDTO): Promise<void>{
    try{
      const newHashtagRival = new this.ig_hashtagRivalModel(createHashtagRival)
      await newHashtagRival.save()
    }catch(e){ throw e }
  }

  async updateHashtagPostText(hashtagPost: HashtagPostINTF): Promise<void>{
    const query = { _id: mongoose.Types.ObjectId(hashtagPost._id) }
    const upd = {text: hashtagPost.text}
    try{
      // this.appLogger.info(this.updateHashtagPostText.name, 'updating Hashtag Post text sentiment: ', hashtagPost.shortcode)
      await this.ig_hashtagPostModel.findByIdAndUpdate(query, upd)
    }catch(e){ throw e }
  }

  async upsertHashtagPosts(params: {hashtagPosts: CreateHashtagPostDTO[], return_news: boolean}): Promise<HashtagPostINTF[]>{
    const {hashtagPosts, return_news} = params
    const upsertdHashtagPosts: HashtagPostINTF[] = []
    try{
      await asyncForEach(hashtagPosts, (async (hashtagPost) => {
        const query = {shortcode: hashtagPost.shortcode}
        const setUpd = {likes: hashtagPost.likes, comments: hashtagPost.comments}
  
        // const setUpd3 = {likes: hashtagPost.likes, comments: hashtagPost.comments, text: {
        //     $cond: {
        //       if: {
        //         $ne: [hashtagPost.text.text, "$text.text"]  //if post text have been updated
        //       },
        //       then: pp, // removing score and magnitude value
        //       else: pp
        //     }
        //   }
        // }
        //TODO: https://stackoverflow.com/questions/61149243/aggregation-query-with-set-in-findoneandupdate-doesnt-update-document
        const toInsert = {ig_id: hashtagPost.ig_id, is_top: hashtagPost.is_top, image_src: hashtagPost.image, text: hashtagPost.text,
                          taken_at_timestamp: hashtagPost.taken_at_timestamp, dimensions: hashtagPost.dimensions, 
                          account_id: hashtagPost.account_id, media_type: hashtagPost.media_type, hashtag: hashtagPost.hashtag,
                          username: hashtagPost.username, carousel_media_count: hashtagPost.carousel_media_count, can_see_insights_as_brand: hashtagPost.can_see_insights_as_brand,
                          place_ig_id: hashtagPost.place_ig_id, is_paid_partnership: hashtagPost.is_paid_partnership, accessibility_caption: hashtagPost.accessibility_caption
                        }
        // this.appLogger.info(this.upsertHashtagPosts.name, 'upserting Hashtag Post : ', hashtagPost.shortcode)
        const upsertdHashtagPost = await this.ig_hashtagPostModel.findOneAndUpdate(query, {$set: setUpd, $setOnInsert: toInsert}, {upsert: true, new: return_news, useFindAndModify: false})
        upsertdHashtagPosts.push(upsertdHashtagPost)
      }))
      return upsertdHashtagPosts
    }catch(err){ throw err }
  }

  async getMaxMinSentiments(params: {hashtag: string}): Promise<ResLimitsSentiment> {
    try{
      const limits: ResLimitsSentiment[] = await this.ig_hashtagPostModel.aggregate([
        { $match: { hashtag: params.hashtag }}, 
        { $group: { _id: { hashtag: '$hashtag' },
            max_score: { $max: '$text.score' },
            min_score: { $min: '$text.score' },
            max_mag: { $max: '$text.magnitude' },
            min_mag: { $min: '$text.magnitude' }
        }},
        { $project: {
            _id: false,
            score: {
              max: { $round: [{ $multiply: ['$max_score', 10]}, 2] },
              min: { $round: [{ $multiply: ['$min_score', 10]}, 2] }
            },
            magnitude: {
              max: { $round: [{ $multiply: ['$max_mag', 10]}, 2] },
              min: { $round: [{ $multiply: ['$min_mag', 10]}, 2] }
            }
          }
        }
      ])
      
      return limits[0] || {} as ResLimitsSentiment
    }catch(err){ throw err }
  }

  async upsertHashtag(params: {hashtag: CreateHashtagDTO, return_new: boolean}): Promise<void>{
    const {hashtag, return_new} = params
    const query = {hashtag: hashtag.hashtag}
    const setUpd = {profile_image_src: hashtag.profile_image_src, posts: hashtag.posts, sentiment_score: hashtag.sentiment_score}
    try{
      // this.appLogger.info(this.upsertHashtag.name, 'upserting Hashtag Data : ', hashtag.hashtag)
      await this.ig_hashtagModel.findOneAndUpdate(query, {$set: setUpd}, {upsert: true, new: return_new})
    }catch(err){ throw err }
  }

  async createHashtagLog(hashtagLog: CreateHashtagLogDTO): Promise<void> {
    try{
      // this.appLogger.info(this.createHashtagLog.name, 'creating Hashtag Log for: ' + hashtagLog.hashtag)
      const newHashtagLog = new this.ig_hashtagLogModel(hashtagLog)
      await newHashtagLog.save()
    }catch(err){ throw err }
  }

  async createHashtagRelationLog(hashtagRelationLogDTO: CreateHashtagRelationLogDTO): Promise<void>{
    try{
      // this.appLogger.info(this.createHashtagRelationLog.name, 'creating Hashtag relation Log for parent: ' + hashtagRelationLogDTO.parent)
      const createHashtagRelationLog = new this.ig_hashtagRelationLogModel(hashtagRelationLogDTO)
      await createHashtagRelationLog.save()
    }catch(e){ throw e }
  }

  //********************************************************************************************* */
  //************************************* PRIVATE FUNCTIONS  ************************************ */

  private async getMaxMagnitude(hashtag: string, _profile_id: string): Promise<number>{
    const resMaxMagnitudeHashtag = await this.ig_hashtagPostModel.aggregate([
      { $match: { hashtag: hashtag }},
      { $group: { 
          _id: '$hashtag',
          max_mag: { $max: { $round: [{ $multiply: ['$text.magnitude', 10]}, 2] }}
      }},
      { $project: { _id: false, magnitude_max: '$max_mag' }}
    ])

    const resMaxMagnitudeTagged = await this.ig_tagPostModel.aggregate([
      { $match: { _profile_id: mongoose.Types.ObjectId(_profile_id) }},
      { $group: { 
          _id: null,
          max_mag: { $max: { $round: [{ $multiply: ['$text.magnitude', 10]}, 2] }}
      }},
      { $project: { _id: false, magnitude_max: '$max_mag' }}
    ])
    
    let max_magnitude = resMaxMagnitudeHashtag[0].magnitude_max
    
    if(resMaxMagnitudeTagged[0].magnitude_max > max_magnitude){
      max_magnitude = resMaxMagnitudeTagged[0].magnitude_max
    }

    return max_magnitude
  }
}