import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDTO as CreateCommentDTO } from './interfaces/Comments/dtos/CreateComment.dto';
import { CommentINTF } from './interfaces/Comments/comment.intf';
import { CreateProfileDTO } from './interfaces/Profile/dtos/CreateProfile.dto';
import { ProfileINTF } from './interfaces/Profile/Profile.intf';
import { ProfileStatsLogINTF } from './interfaces/Profile/ProfileStatsLog.intf';
import { CreateTagINTF } from './interfaces/Tag/createTag.intf';
import { CreateTagDTO } from './interfaces/Tag/dtos/CreateTag.dto';
import { Ig_profile, Ig_profileDocument } from './schemas/ig-profile.schema';
import { Ig_profileStatsLog, Ig_profileStatsLogDocument } from './schemas/ig-profileStatsLog.schema'
import { Ig_tag, Ig_tagDocument } from './schemas/ig-tag.schema';
import { Ig_comment, Ig_commentDocument } from './schemas/ig-comment.schema';
import { ProfilePostDTO as CreateProfilePostDTO} from './interfaces/Profile/dtos/CreateProfilePost.dto';
import { TagPostDTO as CreateTagPostDTO} from './interfaces/Profile/dtos/CreateTagPost.dto';
import { Ig_profilePost, Ig_profilePostDocument } from './schemas/ig-profilePost.schema';
import { ProfilePostINTF } from './interfaces/Profile/ProfilePost.intf';
import { CreateProfilePostStatsLogDTO } from './interfaces/Profile/dtos/CreateProfilePostStatLog.dto';
import { Ig_profilePostStatsLog, Ig_profilePostStatsLogDocument } from './schemas/ig-profilePostStatsLog.schema';
import { ReqBasicSearchDTO } from './interfaces/Profile/Api/ReqBasicSearch.dto';
import mongoose from 'mongoose';
import { ResLimitsSentiment, ResLimitsStatsINTF } from './interfaces/Profile/Api/ResLimitsStats.intf';
import { ResTopTimeToPostINTF, TopHour } from 'src/api/instagram/profile/interfaces/ResTopTimeToPost.intf';
import { TOP_HOURS_OPTIONS } from 'src/api/instagram/profile/interfaces/ReqTopTimeToPost.dto';
import { ResStatsProgressByWeekDay } from './interfaces/Profile/Api/ResStatsProgressByWeekDay.intf';
import { TextStats } from './interfaces/Common/TextStats.intf';
import { CreateProfileStatsLogDTO } from './interfaces/Profile/dtos/CreateProfileStatsLog.dto';
import { AppLoggerService } from '../app-logger/app-logger.service';
import { Ig_place, Ig_placeDocument } from './schemas/ig-place.schema';
import { IReqBasicSearchTS, ReqBasicSearchTSDTO } from './interfaces/Profile/Api/ReqBasicSearchTS.dto';
import { IProfileStats } from 'src/api/instagram/profile/interfaces/ResProfileStats.intf';
import { Day, resBestTimeToPostEmpty, ResBestTimeToPostINTF } from './interfaces/Hashtag/api/ResBestTimeToPost.intf';
import { IProfilePostStatsLog } from './interfaces/Profile/ProfilePostStatsLog.intf';
import { timestampToDate } from 'src/shared/utils/Utils';
import { TagPostINTF } from './interfaces/Profile/TagPost.intf';
import { Ig_tagPost, Ig_tagPostDocument } from './schemas/ig-tagPost.schema';
import { resSentimentScoreEmpty, ResSentimentScoreINTF } from './interfaces/Hashtag/api/ResSentimentScore.intf';
import { IReducedPostList } from './interfaces/Hashtag/api/ResReducedPostList.int';
import { IResHashtagPosts } from './interfaces/Hashtag/api/ResPopularPosts.intf';
import { IReqPopularPosts, ReqPopularPostsDTO } from './interfaces/Profile/Api/ReqPopularPosts';
import { IResSummaryStats, resSummaryStatsEmpty } from './interfaces/Profile/Api/ResSummaryStats.int';
import { IResHashtagStats } from './interfaces/Profile/Api/ResTaggedStats.int';
import { Ig_HashtagPost, Ig_postDocument } from './schemas/ig-hashtagPost.schema';
import { SCORE_POSTS_LIMIT } from 'src/shared/constants/constants';


@Injectable()
export class db_ProfileService {
  private readonly appLogger = new AppLoggerService(db_ProfileService.name)

  constructor(
    @InjectModel(Ig_profile.name) private ig_profileModel: Model<Ig_profileDocument>,
    @InjectModel(Ig_profileStatsLog.name) private ig_profileStatsLogModel: Model<Ig_profileStatsLogDocument>,
    @InjectModel(Ig_tag.name) private ig_tagModel: Model<Ig_tagDocument>,
    @InjectModel(Ig_place.name) private ig_placeModel: Model<Ig_placeDocument>,
    @InjectModel(Ig_comment.name) private ig_commentModel: Model<Ig_commentDocument>,
    @InjectModel(Ig_profilePost.name) private ig_profilePostModel: Model<Ig_profilePostDocument>,
    @InjectModel(Ig_tagPost.name) private ig_tagPostModel: Model<Ig_tagPostDocument>,
    @InjectModel(Ig_profilePostStatsLog.name) private Ig_profilePostStatsLogModel: Model<Ig_profilePostStatsLogDocument>,
    @InjectModel(Ig_HashtagPost.name) private ig_hashtagPostModel: Model<Ig_postDocument>
  ){}

  async getProfileLastStats(param: {profile_ig_id: number}): Promise<ProfileStatsLogINTF>{
    try{
      const lastStats = await this.ig_profileStatsLogModel.findOne({user_ig_id: param.profile_ig_id}).sort({_id: -1})
      return lastStats
    }catch(error){
      throw error
    }
  }

  async getProfileAvgStats(params: {profile: ProfileINTF, min_date: number}): Promise<IProfileStats>{
    const profile_ig_id = params.profile.ig_id
    const _min_date = timestampToDate(params.min_date)
    let avgStats: IProfileStats
    try{
      const mediaCreated = await this.getPostsSinceTimestamp({profile_id: String(params.profile._id), timestamp: params.min_date})
      const rawAvgStats = await this.ig_profileStatsLogModel.aggregate([
        {
          $match: {
            createdAt: { $gte : _min_date },
            user_ig_id: profile_ig_id
          }
        },
        { $facet: {
            last: [{ $sort: { 'createdAt': -1 } }, { $limit: 1 }],
            first: [{ $sort: { 'createdAt': 1 } }, { $limit: 1 }]
        }},
        { $unwind: { path: '$last' }},
        { $unwind: { path: '$first' }},
        { $project: {
            // media: {
            //   $subtract: ['$last.media_count', '$first.media_count']
            // },
            followers: {
              $subtract: ['$last.follower_count', '$first.follower_count']
            },
            following: {
              $subtract: ['$last.following_count', '$first.following_count']
            },
            igtvs: {
              $subtract: ['$last.total_igtv_videos', '$first.total_igtv_videos']
            },
            arEffects: {
              $subtract: ['$last.total_ar_effects', '$first.total_ar_effects']
            },
            tags: {
              $subtract: ['$last.usertags_count', '$first.usertags_count']
            }
        }}
      ])

      if(rawAvgStats?.length >= 1){
        avgStats = {
          media: mediaCreated,
          followers: rawAvgStats[0].followers,
          following: rawAvgStats[0].following,
          igtvs: rawAvgStats[0].igtvs,
          arEffects: rawAvgStats[0].arEffects,
          tags: rawAvgStats[0].tags
        }
      }
      return avgStats
    }catch(error){ throw error }
  }

  async findProfile(param: {profile_id: number | string}): Promise<ProfileINTF>{
    let profile: ProfileINTF = null
    try{
      if(typeof(param.profile_id) === 'string'){
        profile = await this.ig_profileModel.findById({_id: mongoose.Types.ObjectId(param.profile_id)})
      }
      if(typeof(param.profile_id) === 'number'){
        profile = await this.ig_profileModel.findOne({ig_id: param.profile_id})
      }
      return profile
    }catch(error){ throw error }
  }

  async upsertProfile(params: {profile: CreateProfileDTO, return_new: boolean}): Promise<ProfileINTF>{
    const {profile, return_new} = params
    const query = {ig_id: profile.ig_id}
    const set = profile
    try{
      const upsertdProfile = await this.ig_profileModel.findOneAndUpdate(query, {$set: set}, {upsert: true, new: return_new})
      this.appLogger.info(this.upsertProfile.name, 'Profile upserted with ig_id: ' +  upsertdProfile.ig_id)
      return upsertdProfile
    }catch(err){
      this.appLogger.error(this.upsertProfile.name, '', err)
      throw err
    }
  }

  async upsertTag(params: {tag: CreateTagDTO, return_new: boolean}): Promise<CreateTagINTF>{
    const {tag, return_new} = params
    const query = {post_shortcode: tag.post_shortcode}
    const set = tag
    try{
      const upsertdTag = await this.ig_tagModel.findOneAndUpdate(query, {$set: set}, {upsert: true, new: return_new})
      this.appLogger.info(this.upsertTag.name, 'Tag upserted with: ', upsertdTag.tagged_id)
      return upsertdTag
    }catch(err){
      this.appLogger.error(this.upsertTag.name, '', err)
      throw err
    }
  }

  async upsertComment(params: {comment: CreateCommentDTO, return_new: boolean}): Promise<CommentINTF>{
    const {comment, return_new} = params
    const query = {ig_id: comment.ig_id}
    const set = comment
    try{
      this.appLogger.info(this.upsertComment.name, 'upserting Post Comment from post: ' + comment.post_shortcode)
      const upsertdComment = await this.ig_commentModel.findOneAndUpdate(query, {$set: set}, {upsert: true, new: return_new})
      return upsertdComment
    }catch(err){
      this.appLogger.error(this.upsertComment.name, '', err)
      throw err
    }
  }  
  
  async findProfilePostByShortcode(shortcode: string): Promise<ProfilePostINTF>{
    return await this.ig_profilePostModel.findOne({ shortcode: shortcode })
  }

  async getProfilePosts(params: {profile: ProfileINTF, lastPosts?: boolean, max?: number}): Promise<ProfilePostINTF[]>{
    try{
      const limit = params.max || 10
      const updatedSort = params.lastPosts ? -1 :  1
      const profilePosts = await this.ig_profilePostModel.aggregate([
        { $match: {
            _profile_id: params.profile._id
        }},
        { $sort: { taken_at: updatedSort }},
        { $limit:  limit },
        {$project: { _id: false }}
      ])
      return profilePosts || []
    }catch(err){throw err} 
  }


  async createProfilePostStatsLog(profilePostStatsLog: CreateProfilePostStatsLogDTO): Promise<void>{
    try{
      this.appLogger.info(this.createProfilePostStatsLog.name, 'creating profile Post Log: ' + profilePostStatsLog.post_shortcode)
      const createProfilePostStatsLog = new this.Ig_profilePostStatsLogModel(profilePostStatsLog)
      await createProfilePostStatsLog.save()
    }catch(err){
      this.appLogger.error(this.createProfilePostStatsLog.name, '', err)
      throw err
    }
  }

  async findLastProfilePostStatsLog(shortcode: string): Promise<IProfilePostStatsLog>{
    try{
      const lastPostStatsLog = await this.Ig_profilePostStatsLogModel.aggregate([
        { $match: {post_shortcode: shortcode}},
        { $sort: {createdAt : -1}},
        { $limit: 1}
      ])
      return lastPostStatsLog[0]
    }catch(err){
      this.appLogger.error(this.findLastProfilePostStatsLog.name, '', err)
      throw err
    }
  }

  async updateProfilePostText(profilePost: ProfilePostINTF): Promise<void>{
    const query = { _id: profilePost._id }
    const upd = { text: profilePost.text }
    try{
      this.appLogger.info(this.updateProfilePostText.name, 'Updating profile posts texts with shortcode: ' + profilePost.shortcode  )
      await this.ig_profilePostModel.findByIdAndUpdate(query, upd)
    }catch(e){
      throw e
    }
  }

  async updateTagPostText(tagPost: TagPostINTF): Promise<void>{
    const query = { _id: tagPost._id }
    const upd = { text: tagPost.text }
    try{
      this.appLogger.info(this.updateTagPostText.name, 'Updating tag posts texts with shortcode: ' + tagPost.shortcode  )
      await this.ig_tagPostModel.findByIdAndUpdate(query, upd)
    }catch(e){ throw e }
  }

  async createProfileStatsLog(createProfileStatsLogDTO: CreateProfileStatsLogDTO): Promise<Ig_profileStatsLog> {
    const createdProfileStatsLog = new this.ig_profileStatsLogModel(createProfileStatsLogDTO)
    return createdProfileStatsLog.save()
  }


  async updateProfile(profile: ProfileINTF): Promise<void>{
    const query = { _id: profile._id }
    try{
      this.appLogger.info(this.updateProfile.name, 'updating profile with ig_id: ' + profile.ig_id)
      await this.ig_profileModel.findByIdAndUpdate(query, profile)
    }catch(e){
      this.appLogger.error(this.updateProfile.name, 'throwing error: ', e)
      throw e
    }
  }

  async updateCommentText(comment: CommentINTF): Promise<void>{
    const query = { _id: comment._id }
    const upd = { text: comment.text }
    try{
      await this.ig_commentModel.findByIdAndUpdate(query, upd)
    }catch(e){
      throw e
    }
  }

  async upsertProfilePost(params: {profilePost: CreateProfilePostDTO, return_new: boolean}): Promise<ProfilePostINTF>{
    const {profilePost, return_new} = params
    const query = {shortcode: profilePost.shortcode}
    const set = profilePost
    try{
      this.appLogger.info(this.upsertProfilePost.name, 'upserting Profile Post: ' + profilePost.shortcode)
      const upsertdProfilePost = await this.ig_profilePostModel.findOneAndUpdate(query, {$set: set}, {upsert: true, new: return_new})
      return upsertdProfilePost
    }catch(err){
      this.appLogger.error(this.upsertProfilePost.name, '', err)
      throw err
    }
  }

  async upsertTagPost(params: {tagPost: CreateTagPostDTO, return_new: boolean}): Promise<TagPostINTF>{
    const { tagPost, return_new} = params
    const query = {shortcode: tagPost.shortcode}
    const set = tagPost
    try{
      this.appLogger.info(this.upsertTagPost.name, 'upserting Tag Post: ' + tagPost.shortcode)
      const upsertdTagPost = await this.ig_tagPostModel.findOneAndUpdate(query, {$set: set}, {upsert: true, new: return_new})
      return upsertdTagPost
    }catch(err){
      this.appLogger.error(this.upsertTagPost.name, '', err)
      throw err
    }
  }

  async getBestTimeToPost(reqBestTimeToPost: ReqBasicSearchDTO): Promise<ResBestTimeToPostINTF>{
    try{
      const dayHourStats = await this.Ig_profilePostStatsLogModel.aggregate([
        {
          $match: {
            _profile_id: mongoose.Types.ObjectId(reqBestTimeToPost._profile_id),
            createdAt: {
              $gte : new Date(reqBestTimeToPost.min_date)
            },
          }
        },
        { $addFields: {
            diffLikes: { $subtract: ['$likes', '$lastLikes'] },
            diffComments: { $subtract: ['$comments', '$lastComments'] }
        }},
        { $group: {
            _id: {
              day: { "$dayOfWeek": "$createdAt" },
              hour: { "$hour": "$createdAt" }
            },
            likes: { $avg: '$likes' },
            comments: { $avg: '$comments' },
            diffLikes: { $avg: '$diffLikes' },
            diffComments: { $avg: '$diffComments' }
        }},
        { $group: {
            _id: '$_id.day',
            hours: {
              $push: {
                hour: { $round: ['$_id.hour', 2] },
                likes: { $round: ['$likes', 2] },
                comments: { $round: ['$comments', 2] },
                diffLikes: { $round: ['$diffLikes', 2] },
                diffComments: { $round: ['$diffComments', 2] }
              }
            }
        }},
        { $project: {
            day_number: { $sum: ['$_id', -1] },
            hoursStats: '$hours',
            _id: false
        }}
      ])

      const limitsStats = await this.getLimitsDifferences(dayHourStats)
      if(dayHourStats?.length > 0){
        const resBestTimeToPost: ResBestTimeToPostINTF = {
          days: dayHourStats,
          likes_stats: limitsStats.likes,
          comments_stats: limitsStats.comments
        }
        return resBestTimeToPost
      }

      return resBestTimeToPostEmpty
    }catch(e){ throw e }
  }

  async getTopTimeToPost(reqBestTimeToPost: ReqBasicSearchDTO): Promise<ResTopTimeToPostINTF>{
    try{  
      const hoursSortedByLikes = await this.getSortedHoursByStat({basicSearch: reqBestTimeToPost, sortOption: TOP_HOURS_OPTIONS.LIKES, size: 6})
      const hoursSortedByComments = await this.getSortedHoursByStat({basicSearch: reqBestTimeToPost, sortOption: TOP_HOURS_OPTIONS.COMMENTS, size: 6})
      //const hoursSortedByViews = await this.getSortedHoursByStat({basicSearch: reqBestTimeToPost, sortOption: TOP_HOURS_OPTIONS.VIEWS, size: 6})
      const resTopTimeToPost: ResTopTimeToPostINTF = {
        likes: hoursSortedByLikes,
        comments: hoursSortedByComments
        //views: hoursSortedByViews
      }
      return resTopTimeToPost
    }catch(e){ throw e }
  }


  async getSortedHoursByStat(params: {basicSearch: ReqBasicSearchDTO, size: number, sortOption: TOP_HOURS_OPTIONS}): Promise<TopHour[]>{
    let sortCondition
    switch(params.sortOption){
      case TOP_HOURS_OPTIONS.LIKES: 
        sortCondition = { likes: -1 }
        break
      case TOP_HOURS_OPTIONS.COMMENTS:
        sortCondition = { comments: -1 }
        break
      case TOP_HOURS_OPTIONS.VIEWS:
        sortCondition = { views: -1 }
        break
    }
    try{
      const hoursSorted = await this.Ig_profilePostStatsLogModel.aggregate([
        { $match: {
          _profile_id: mongoose.Types.ObjectId(params.basicSearch._profile_id),
          createdAt: {
            $gte : new Date(params.basicSearch.min_date)
          }
        }},
        { $addFields: {
            diffLikes: { $subtract: ['$likes', '$lastLikes'] },
            diffComments: { $subtract: ['$comments', '$lastComments'] }
        }},
        { $group: {
            _id: {
              day_n: { '$dayOfWeek': '$createdAt' },
              hour_n: { '$hour': '$createdAt' }
            },
            likes: { $avg: '$diffLikes' },
            comments: { $avg: '$diffComments' }
        }},
        { $project: {
            day_number: { $sum: ['$_id.day_n', -1] },
            day_hour: '$_id.hour_n',
            likes: { $round: ['$likes', 2] },
            comments: { $round: ['$comments', 2] },
            _id: false
        }},
        { $sort: sortCondition},
        { $limit: params.size }
      ])

      return hoursSorted
    }catch(e){ throw e }
  }

  async getTextStats(reqTextStats: ReqBasicSearchTSDTO): Promise<TextStats[]>{
    try{
      const textStats = new ReqBasicSearchTSDTO(reqTextStats)
      const resTextStats = await this.ig_profilePostModel.aggregate([
        {
         $match: {
           _profile_id: mongoose.Types.ObjectId(textStats._profile_id),
           taken_at: { $gte : textStats.min_date}
         }
       },
       { $project: {
          text: '$text.text',
          likes: '$likes_count',
          comments: '$comments_count',
          views: '$view_count',
          _id: false
        }}
     ])
     return resTextStats
    }catch(e){
      throw e
    }
  }

  async getStatsProgressByWeekDay(reqBasicSearch: ReqBasicSearchTSDTO): Promise<ResStatsProgressByWeekDay[]>{
    try{
      const weekStats = new ReqBasicSearchTSDTO(reqBasicSearch)
      const statsProgressByWeekDay = await this.ig_profilePostModel.aggregate([
        {
          $match: {
            _profile_id: mongoose.Types.ObjectId(weekStats._profile_id),
            taken_at: { $gte : weekStats.min_date }
          }
        },
        {
          $group: {
            _id: {
              $dayOfWeek:  {$toDate: {$multiply: ['$taken_at', 1000]}} 
            },
            likes: {
              $sum: '$likes_count'
            },
            comments: {
              $sum: '$comments_count'
            }
          },
        }, 
        {
          $project: {
            _id: false,
            day_number: '$_id', 
            likes: '$likes', 
            comments: '$comments'
          }
        },
        { $sort: { day_number: +1 }}
      ])

      return statsProgressByWeekDay || []
    }catch(e){
      throw e
    }
  }

  async getUnanalyzedProfilePosts(params: {profile_id: string, since_date?: Date, limit: number}): Promise<ProfilePostINTF[]>{
    let queryMatch
    const _since_date: Date | number = params.since_date ?? 0
    if(params.profile_id){
      queryMatch = {
        _profile_id: mongoose.Types.ObjectId(params.profile_id),
        createdAt: { $gte: new Date(_since_date)},
        "text.text": {$ne: ""},
        "text.score": {'$exists': false}
      }
    }else{
      queryMatch = {
        createdAt: { $gte: new Date(_since_date)},
        "text.text": {$ne: ""},
        "text.score": {'$exists': false}
      }
    }
    
    try{
      const resUnanalyzedPosts = await this.ig_profilePostModel.aggregate([
        { $match: queryMatch },
        { $sort: { createdAt: +1 } },
        { $limit: params.limit}
      ])
      return resUnanalyzedPosts || []
    }catch(e){
      throw e
    }
  }
  
  async getUnanalyzedTagPosts(params: {profile_id: string, since_date?: Date, limit: number}): Promise<TagPostINTF[]>{
    let queryMatch
    const _since_date: Date | number = params.since_date ?? 0
    if(params.profile_id){
      queryMatch = {
        _profile_id: mongoose.Types.ObjectId(params.profile_id),
        createdAt: { $gte: new Date(_since_date)},
        "text.text": {$ne: ""},
        "text.score": {'$exists': false}
      }
    }else{
      queryMatch = {
        createdAt: { $gte: new Date(_since_date)},
        "text.text": {$ne: ""},
        "text.score": {'$exists': false}
      }
    }
    
    try{
      const resUnanalyzedTagPosts = await this.ig_tagPostModel.aggregate([
        { $match: queryMatch },
        { $sort: { createdAt: +1 } },
        { $limit: params.limit}
      ])
      return resUnanalyzedTagPosts || []
    }catch(e){ throw e }
  }

  async getUnanalyzedComments(params: {profile_id: string, since_date: Date, limit: number}): Promise<CommentINTF[]>{
    let queryMatch
    if(params.profile_id){
      queryMatch = {
        post_owner_id: mongoose.Types.ObjectId(params.profile_id),
        createdAt: { $gte: new Date(params.since_date)},
        "text.text": {$ne: ""},
        "text.score": {'$exists': false}
      }
    }else{
      queryMatch = {
        createdAt: { $gte: new Date(params.since_date)},
        "text.text": {$ne: ""},
        "text.score": {'$exists': false}
      }
    }
    
    try{
      const resUnanalyzedPosts = await this.ig_commentModel.aggregate([
        {
          $match: queryMatch
        },
        { $sort: { createdAt: +1 } },
        { $limit: params.limit}
      ])
      return resUnanalyzedPosts || []
    }catch(e){ throw e }
  }

  async getPostsSinceTimestamp(params: {profile_id: string, timestamp: number}): Promise<number> {
    const {profile_id, timestamp} = params
    try{
      const posts = await this.ig_profilePostModel.aggregate([
        { $match: {
            taken_at: { $gte : (timestamp/1000) },
            _profile_id:  mongoose.Types.ObjectId(profile_id)
        }},
        { $group: {
            _id: {profile: '$_profile_id'},
            media: {$sum: 1}
        }},
        { $project: { _id: false }}
      ])

      return posts[0]?.media || 0
    }catch(err){ throw err }
  }

  async getSentimentScoreComments(reqBasicSearch: ReqBasicSearchTSDTO): Promise<ResSentimentScoreINTF>{
    try{
      const sentimentScore = new ReqBasicSearchTSDTO(reqBasicSearch)
      const comments_score = await this.ig_commentModel.aggregate([
        { $match: {
          post_owner_id: mongoose.Types.ObjectId(sentimentScore._profile_id),
          "text.score": {'$exists': true},
          taken_at: { $gte : sentimentScore.min_date },
        }},
        { $group:{
          _id: null,
          score: {'$avg': "$text.score"},
          magnitude: {'$avg': "$text.magnitude"},
          posts:{$sum:1},
          pos: {$push: {
            "$cond":[
              {"$gte":["$text.score", 0.25]},
              {'score': "$text.score", 'magnitude': "$text.magnitude", "count": 1},
              "$$REMOVE"]
          }},
          neg: {$push: {
            "$cond":[
              {"$lte":["$text.score", -0.25]},
              {'score': "$text.score", 'magnitude': "$text.magnitude", "count": 1},
              "$$REMOVE"]
          }}
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
      return comments_score[0] || resSentimentScoreEmpty
    }catch(err){ throw err }
  }
  
  async getSentimentScoreTaggedPosts(reqSentimentScoreINTF: IReqBasicSearchTS): Promise<ResSentimentScoreINTF> {
    try{
      const reqSentimentScore = new ReqBasicSearchTSDTO(reqSentimentScoreINTF)
      const resSentimentScore = await this.ig_tagPostModel.aggregate([
        { $match: {
          taken_at: { $gte: reqSentimentScore.min_date},
          _profile_id: mongoose.Types.ObjectId(reqSentimentScore._profile_id)
          }
        },
        { $group: {
          _id: null,
          score: {'$avg': "$text.score"},
          magnitude: {'$avg': "$text.magnitude"},
          posts:{$sum:1},
          pos: {$push: {
            "$cond":[
              {"$gte":["$text.score", 0.25]},
              {'score': "$text.score", 'magnitude': "$text.magnitude", "count": 1},
              "$$REMOVE"]
          }},
          neg: {$push: {
            "$cond":[
              {"$lte":["$text.score", -0.25]},
              {'score': "$text.score", 'magnitude': "$text.magnitude", "count": 1},
              "$$REMOVE"]
          }}
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
      return resSentimentScore[0] || []
    }catch(e){ throw e }
  }

  async getClassifiedComments(reqBasicSearch: ReqBasicSearchTSDTO): Promise<IReducedPostList>{
    try{
      const sentimentScore = new ReqBasicSearchTSDTO(reqBasicSearch)

      const comments_score = await this.ig_commentModel.aggregate([
        { $match: {
          post_owner_id: mongoose.Types.ObjectId(sentimentScore._profile_id),
          "text.score": {'$exists': true},
          taken_at: { $gte : sentimentScore.min_date },
        }},
        { $sort: {taken_at: -1}},
        { $group:{
          _id: null,
          pos: {$push:
          {
            "$cond":[
              {"$gte":["$text.score", 0.25]},
              {'text': "$text.text",'shortcode': "$post_shortcode",'takenAt': "$taken_at"},
              "$$REMOVE"]
          }},
          neg: {$push:
          {
            "$cond":[
              {"$lte":["$text.score", -0.25]},
              {'text': "$text.text",'shortcode': "$post_shortcode",'takenAt': "$taken_at"},
              "$$REMOVE"]
          }},
          neu: {$push:
          {
            "$cond":[
              { $and:[
                {"$lte":["$text.score", 0.25]},
                {"$gte":["$text.score", -0.25]}]
              },
              {'text': "$text.text",'shortcode': "$post_shortcode",'takenAt': "$taken_at"},
              "$$REMOVE"]
          }}
        }},
        { $project: {
          _id: false,
          positives: {$slice: ["$pos", SCORE_POSTS_LIMIT]},
          negatives: {$slice: ["$neg", SCORE_POSTS_LIMIT]},
          neutrals: {$slice: ["$neu", SCORE_POSTS_LIMIT]}
        }}
      ])

      return comments_score[0] || []
    }catch(err){ throw err }
  }

  async getMaxMinSentimentsTaggedPosts(params: {_profile_id: string}): Promise<ResLimitsSentiment> {
    try{
      const limits: ResLimitsSentiment[] = await this.ig_tagPostModel.aggregate([
        { $match: { _profile_id: mongoose.Types.ObjectId(params._profile_id) }}, 
        { $group: { _id: null,
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

  async getPopularPosts(reqPopularTaggedPosts: IReqPopularPosts): Promise<IResHashtagPosts[]>{
    try{
      const reqPopularTaggedPostsDTO = new ReqPopularPostsDTO(reqPopularTaggedPosts)
      const topLimit = parseInt(reqPopularTaggedPostsDTO.top)
      const max_magnitude = await this.getMaxMagnitude(reqPopularTaggedPostsDTO._profile_id, reqPopularTaggedPostsDTO.hashtag)

      const resPopularPosts = await this.ig_tagPostModel.aggregate([
        { $match: {
          _profile_id: mongoose.Types.ObjectId(reqPopularTaggedPostsDTO._profile_id),
          taken_at: { $gte : reqPopularTaggedPostsDTO.min_date }
        }},
        { $project: {
          _id: false,
          shortcode: '$shortcode',
          score:{ $round: [{ $multiply: ['$text.score', 10]}, 2] },
          magnitude: { $round: [{ $multiply: ['$text.magnitude', 10]}, 2] },
          text: '$text.text',
          likes: '$likes_count',
          comments: '$comments_count',
          takenAt: '$taken_at'
        }},
        { $addFields: {
            score_pct:{$divide:[{$subtract: ['$score',  -10]}, 20]},
            magnitude_pct:{$divide:['$magnitude', max_magnitude]},
        }},
        { $project: {
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
    
      return resPopularPosts || []
    }catch(e){ throw e }
  }

  async getLatestPosts(reqTaggedPosts: IReqPopularPosts): Promise<IResHashtagPosts[]>{
    try{
      const reqLatestPostsDTO = new ReqPopularPostsDTO(reqTaggedPosts)
      const limit = parseInt(reqLatestPostsDTO.top)
      const max_magnitude = await this.getMaxMagnitude(reqLatestPostsDTO._profile_id, reqLatestPostsDTO.hashtag)

      const resLatestPosts = await this.ig_tagPostModel.aggregate([
        { $match: {
            _profile_id: mongoose.Types.ObjectId(reqLatestPostsDTO._profile_id),
            taken_at: { $gte : reqLatestPostsDTO.min_date }
          }
        },
        { $project: {
          _id: false,
          shortcode: '$shortcode',
          score: { $round: [{ $multiply: ['$text.score', 10]}, 2] },
          magnitude: { $round: [{ $multiply: ['$text.magnitude', 10]}, 2] },
          text: '$text.text',
          likes: '$likes_count',
          comments: '$comments_count',
          takenAt: '$taken_at',
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

  async getTaggedSummaryStats(reqTaggedStats :IReqBasicSearchTS): Promise<IResSummaryStats>{
    try{
      const taggedStats = new ReqBasicSearchTSDTO(reqTaggedStats)
      const statsLogsByDay = await this.getTaggedStatsByDay(reqTaggedStats)
      const stats = await this.ig_tagPostModel.aggregate([
        { $match: {
            _profile_id: mongoose.Types.ObjectId(taggedStats._profile_id),
            taken_at: { $gte : taggedStats.min_date }
        }}, 
        { $group: {
          _id: null, 
          likes: { $sum: '$likes_count' },
          comments: { $sum: '$comments_count' },
          posts: { $sum: 1 },
          unique_profiles: {'$addToSet': '$ig_id'}
        }},
        { $project: {
          _id: false,
          likes: '$likes',
          comments: '$comments',
          posts: '$posts',
          unique_profiles: {'$size': '$unique_profiles'}
        }}
      ])

      if(stats[0]){
        const summaryStats: IResSummaryStats = {
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
    }catch(e){ throw e }
  }

  async getTaggedStatsByDay(reqTaggedStats :IReqBasicSearchTS): Promise<IResHashtagStats[]>{
    try{
      const taggedStats = new ReqBasicSearchTSDTO(reqTaggedStats)
      const tag_stats = await this.ig_tagPostModel.aggregate([
        { $addFields: {
          'takenDate': { $toDate: { $multiply: ['$taken_at', 1000] }}
        }},
        { $match: {
            _profile_id: mongoose.Types.ObjectId(taggedStats._profile_id),
            taken_at: { $gte : taggedStats.min_date }
        }},
        { $group : {
            _id: { 
              '$dateToString': { format: "%Y-%m-%d", date: "$takenDate" }
            },
            likes: { $sum: "$likes_count" },
            comments: { $sum: "$comments_count" },
            unique_profiles: {'$addToSet': '$ig_id'},
            posts: { $sum: 1 }
        }},
        { $sort: { _id: 1 }},
        { $project: {
            _id: false,
            time: '$_id',
            likes: '$likes',
            comments: '$comments',
            unique_profiles: {'$size': '$unique_profiles'},
            posts: '$posts'
        }}
      ])
  
      return tag_stats || []
    }catch(e){ throw e }
  }

  // *********************************************************************************** //
  // *********************************************************************************** //
  // ******************************** PRIVATE FUNCTIONS ******************************** //

  private getLimitsDifferences(hoursStats: Day[]): ResLimitsStatsINTF{
    let maxLikes = 0, minLikes = 0
    let maxComments = 0, minComments = 0

    hoursStats.forEach(dayStat => {
      dayStat.hoursStats.forEach(hourStat => {
        if(hourStat.diffLikes){
          if(hourStat.diffLikes > maxLikes){
            maxLikes = hourStat.diffLikes
          }
          if(hourStat.diffLikes < minLikes){
            minLikes = hourStat.diffLikes
          }
        }
    
        if(hourStat.diffComments){
          if(hourStat.diffComments > maxComments){
            maxComments = hourStat.diffComments
          }
          if(hourStat.diffComments < maxComments){
            minComments = hourStat.diffComments
          }
        }
      })
    })

    const res: ResLimitsStatsINTF = {
      likes: {
        min: minLikes,
        max: maxLikes
      },
      comments: {
        min: minComments,
        max: maxComments
      }
    }

    return res
  }

  private async getMaxMagnitude(_profile_id: string, hashtag: string): Promise<number>{
    const resMaxMagnitudeTagged = await this.ig_tagPostModel.aggregate([
      { $match: { _profile_id: mongoose.Types.ObjectId(_profile_id) }},
      { $group: { 
          _id: null,
          max_mag: { $max: { $round: [{ $multiply: ['$text.magnitude', 10]}, 2] }}
      }},
      { $project: { _id: false, magnitude_max: '$max_mag' }}
    ])

    const resMaxMagnitudeHashtag = await this.ig_hashtagPostModel.aggregate([
      { $match: { hashtag: hashtag }},
      { $group: { 
          _id: '$hashtag',
          max_mag: { $max: { $round: [{ $multiply: ['$text.magnitude', 10]}, 2] }}
      }},
      { $project: { _id: false, magnitude_max: '$max_mag' }}
    ])

    let max_magnitude = resMaxMagnitudeHashtag[0].magnitude_max
    
    if(resMaxMagnitudeTagged[0].magnitude_max > max_magnitude){
      max_magnitude = resMaxMagnitudeTagged[0].magnitude_max
    }

    return max_magnitude;
  }
}
