import { Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Ig_profile } from './schemas/ig-profile.schema';
import { Ig_tag, Ig_tagDocument } from './schemas/ig-tag.schema';
import { PlaceINTF } from './interfaces/Place/Place.intf';
import { CommentDTO as CreateCommentDTO} from './interfaces/Comments/dtos/CreateComment.dto'
import { CommentINTF as CommentINTF} from './interfaces/Comments/comment.intf'
import { PlaceDTO as CreatePlaceDTO, PlaceDTO} from './interfaces/Place/dtos/CreatePlace.dto'
import { Ig_place, Ig_placeDocument} from './schemas/ig-place.schema'
import { Ig_comment, Ig_commentDocument } from './schemas/ig-comment.schema';
import { Ig_profilePost, Ig_profilePostDocument } from './schemas/ig-profilePost.schema';
import { WebFeeds_Topics, WebFeeds_TopicsDocument } from './schemas/webFeeds_topics.schema';
import { WebFeeds_topicsINTF } from './interfaces/WebFeeds/webFeeds_topics.intf';
import { CountryINTF } from './interfaces/Common/Country.dto';
import { Country, CountryDocument } from './schemas/country.schema';
import { WebFeeds_countryLang, WebFeeds_countryLangINTF } from './interfaces/WebFeeds/webFeeds_countryLang.intf';
import { WebFeeds_countryLangDocument } from './schemas/webFeeds_countryLang.schema';
import { WebFeeds_countryLanguagesINTF } from './interfaces/WebFeeds/webFeeds_countryLanguages.intf';
import { Ig_influencer, Ig_influencerDocument } from './schemas/ig-influencers.schema';
import { AppLoggerService } from '../app-logger/app-logger.service';
import { IInfluencer } from './interfaces/Influencer/Influencer.intf';
import { CreateInfluencerDTO } from './interfaces/Influencer/dtos/CreateInfluencer.dto';
import { ProfileINTF } from './interfaces/Profile/Profile.intf';
import { Sys_hashtagPostsLog, Sys_hashtagPostsLogDocument } from './schemas/sys-hashtagPostsLog.schema';
import { Sys_profileLog, Sys_profileLogDocument } from './schemas/sys-profileLog.schema';
import { Sys_profilePostsLog, Sys_profilePostsLogDocument } from './schemas/sys-profilePostsLog.schema';
import { Sys_profileCommentsLog, Sys_profileCommentsLogDocument } from './schemas/sys-profileCommentsLog.schema';
import { CreateSysExecutionLogDTO } from './interfaces/System/dtos/CreateSysExecutionLog.dto';
import { ISys_executionLog } from './interfaces/System/Sys_executionLog.intf';
import { ISysHashtagPostsLog } from './interfaces/System/Sys_hashtagPostsLog.intf';
import { IClient } from 'src/users/database/interface/Client.intf';
import { Sys_tagPostsLog, Sys_tagPostsLogDocument } from './schemas/sys-tagPostsLog.schema';

@Injectable()
export class DatabaseService {
  private readonly appLogger = new AppLoggerService(DatabaseService.name)

  constructor(
    @InjectModel(Ig_tag.name) private ig_tagModel: Model<Ig_tagDocument>,
    @InjectModel(Ig_place.name) private ig_placeModel: Model<Ig_placeDocument>,
    @InjectModel(Ig_influencer.name) private ig_influencerModel: Model<Ig_influencerDocument>,
    @InjectModel(Ig_comment.name) private ig_commentModel: Model<Ig_commentDocument>,
    @InjectModel(Ig_profilePost.name) private ig_profilePostModel: Model<Ig_profilePostDocument>,
    @InjectModel(WebFeeds_Topics.name) private webFeeds_topicsModel: Model<WebFeeds_TopicsDocument>,
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
    @InjectModel(WebFeeds_countryLang.name) private webFeeds_CountryLangModel: Model<WebFeeds_countryLangDocument>,
    @InjectModel(Sys_hashtagPostsLog.name) private sys_hashtagPostsLogModel: Model<Sys_hashtagPostsLogDocument>,
    @InjectModel(Sys_profileLog.name) private sys_profileLogModel: Model<Sys_profileLogDocument>,
    @InjectModel(Sys_profilePostsLog.name) private sys_profilePostsLogModel: Model<Sys_profilePostsLogDocument>,
    @InjectModel(Sys_tagPostsLog.name) private sys_tagPostsLogModel: Model<Sys_tagPostsLogDocument>,
    @InjectModel(Sys_profileCommentsLog.name) private sys_profileCommentsLogModel: Model<Sys_profileCommentsLogDocument>
  ){}

  
  // ********************* Tag ********************** //
  async findByTagged(taggedProfile: number): Promise<Ig_tag[]>{
    return await this.ig_tagModel.find().populate({
      path: 'tagged_id',
      match: { ig_id: taggedProfile }
    }).exec()
  }

  // ********************** Place ******************* //
  async findPlaceByIg_id(ig_id): Promise<PlaceINTF>{
    return await this.ig_placeModel.findOne({ ig_id: ig_id })
  }

  async createPlace(createPlaceDTO: CreatePlaceDTO): Promise<PlaceINTF>{
    const createPlace = new this.ig_placeModel(createPlaceDTO)
    return await createPlace.save()
  }

  async upsertPlace(params: {place: PlaceDTO, return_new: boolean}): Promise<PlaceINTF>{
    const {place: place, return_new} = params
    const query = { ig_id: place.ig_id }
    const set = place
    try{
      this.appLogger.info(this.upsertPlace.name, 'upserting Place with: ', place.name)
      const upsertedPlace = await this.ig_placeModel.findOneAndUpdate(query, {$set: set}, {upsert: true, new: return_new})
      return upsertedPlace
    }catch(err){
      this.appLogger.error(this.upsertPlace.name, '', err)
      throw err
    }
  }

  // ********************** Comment ******************* //
  async createComment(createCommentDTO: CreateCommentDTO): Promise<CommentINTF>{
    const createComment = new this.ig_commentModel(createCommentDTO)
    return await createComment.save()
  }

  // ********************* WebFeeds ********************** //
  async getWebFeeds_topics(): Promise<WebFeeds_topicsINTF[]>{
    return await this.webFeeds_topicsModel.find()
  }
  
  async getWebFeeds_countryLang(): Promise<WebFeeds_countryLangINTF[]>{
    console.info('***** LOADING COUNTRY-LANG *****')
    return await this.webFeeds_CountryLangModel.find()
  }

  async getWebFeeds_countryLanguages(): Promise<WebFeeds_countryLanguagesINTF[]>{
    return await this.webFeeds_CountryLangModel.aggregate([
      {
        $group : {
          _id: "$country",
          languages: { $addToSet: "$lang" }
        }
      },
      { 
        $project: {
          _id: 0,
          country: '$_id',
          languages: '$languages'
        }
      }
    ])
  }

  // ********************* Commons ********************** //
  async getCountries(): Promise<CountryINTF[]>{
    return await this.countryModel.find()
  }

  async findInfluencer(params: {ig_id: number}): Promise<IInfluencer>{
    const {ig_id} = params
    try{
      return await this.ig_influencerModel.findOne({ig_id: ig_id})
    }catch(e){ throw e }
  }

  async findInfluencers(influencerQuery: FilterQuery<IInfluencer>): Promise<IInfluencer[]>{
    try{
      return await this.ig_influencerModel.find(influencerQuery as Record<string, unknown>)
    }catch(e){ throw e}
  }

  async updateInfluencer(params: {ig_id: number, profile: ProfileINTF}): Promise<void>{
    const { ig_id, profile } = params
    const newProfile = profile as Ig_profile
    const query = { ig_id: ig_id }
    const setUpd = { profile: newProfile }
    try{
      if(profile._id){
        this.appLogger.info(this.createInfluencer.name, 'updating Influencer with profile: ' + profile._id)
        await this.ig_influencerModel.updateOne(query, setUpd)
      }
    }catch(e){ throw e }
  }

  async createInfluencer(influencerINTF: IInfluencer): Promise<void>{
    try{
      const newInfluencerDTO = new CreateInfluencerDTO(influencerINTF)
      this.appLogger.info(this.createInfluencer.name, 'creating an Influencer with ig_id: ' + influencerINTF.ig_id)
      const newInfluencer = new this.ig_influencerModel(newInfluencerDTO)
      await newInfluencer.save()
    }catch(e){ throw e }
  }

  async upsertInfluencer(influencerINTF: IInfluencer): Promise<void>{
    const query = {ig_id: influencerINTF.ig_id}
    // const setUpd = { profile: influencerINTF.profile, full_name: influencerINTF.full_name, category: influencerINTF.category,
    //   is_business: influencerINTF.is_business, city_name: influencerINTF.city_name, email: influencerINTF.email,
    //   whatsapp_number: influencerINTF.whatsapp_number, contact_phone_number: influencerINTF.contact_phone_number,
    //   clients_hashtags: influencerINTF.clients_hashtags}
    const setUpd = influencerINTF
    try{
      this.appLogger.info(this.upsertInfluencer.name, 'upserting Influencer with ig_id : ', influencerINTF.ig_id)
      await this.ig_influencerModel.findOneAndUpdate(query, {$set: setUpd}, {upsert: true, new: false})
    }catch(err){ throw err }
  }


  /******************************************** System ************************************************/
  async lastSysProfileLog(client: IClient): Promise<ISys_executionLog>{
    try{
      const sysProfileLog = await this.sys_profileLogModel.aggregate([
        { $match: { client: client._id }},
        { $sort: { timestamp: -1 } },
        { $project: { _id: false }},
        { $limit: 1 }
      ])

      return sysProfileLog[0] || { timestamp: 0, timesInDay: 0, processedItems: 0, client: client._id, execution_state: 0}
    }catch(err){ throw err }
  }
  
  async lastSysProfilePostsLog(client: IClient): Promise<ISys_executionLog>{
    try{
      const sysProfilePostsLog = await this.sys_profilePostsLogModel.aggregate([
        { $match: { client: client._id }},
        { $sort: { timestamp: -1 } },
        { $project: { _id: false }},
        { $limit: 1 }
      ])

      return sysProfilePostsLog[0] || { timestamp: 0, timesInDay: 0, processedItems: 0, client: client._id, execution_state: 0}
    }catch(err){ throw err }
  }  
  
  async lastSysTagPostsLog(client: IClient): Promise<ISys_executionLog>{
    try{
      const sysTagPostsLog = await this.sys_tagPostsLogModel.aggregate([
        { $match: { client: client._id }},
        { $sort: { timestamp: -1 } },
        { $project: { _id: false }},
        { $limit: 1 }
      ])

      return sysTagPostsLog[0] || { timestamp: 0, timesInDay: 0, processedItems: 0, client: client._id, execution_state: 0}
    }catch(err){ throw err }
  }

  async lastSysProfileCommentsLog(client: IClient): Promise<ISys_executionLog>{
    try{
      const sysProfileCommentsLog = await this.sys_profileCommentsLogModel.aggregate([
        { $match: { client: client._id }},
        { $sort: { timestamp: -1 } },
        { $project: { _id: false }},
        { $limit: 1 }
      ])

      return sysProfileCommentsLog[0] || { timestamp: 0, timesInDay: 0, processedItems: 0, client: client._id, execution_state: 0}
    }catch(err){ throw err }
  }

  async lastSysHashtagPostsLog(client: IClient): Promise<ISys_executionLog>{
    try{
      const sysHashtagPostsLog = await this.sys_hashtagPostsLogModel.aggregate([
        { $match: { client: client._id }},
        { $sort: { timestamp: -1 } },
        { $project: { _id: false }},
        { $limit: 1 }
      ])

      return sysHashtagPostsLog[0] || { timestamp: 0, timesInDay: 0, processedItems: 0, client: client._id, execution_state: 0}
    }catch(err){ throw err }
  }


  async createSysProfileLog(createSysProfileLogINTF: ISys_executionLog): Promise<void>{
    const createSysProfileLogDTO = new CreateSysExecutionLogDTO(createSysProfileLogINTF)
    const createSysProfileLog = new this.sys_profileLogModel(createSysProfileLogDTO)
    this.appLogger.info(this.createSysProfileLog.name, 'saving createSysProfileLog')
    await createSysProfileLog.save()
  }

  async createSysProfilePostsLog(createSysProfileLogINTF: ISys_executionLog): Promise<void>{
    const createSysProfilePostsLogDTO = new CreateSysExecutionLogDTO(createSysProfileLogINTF)
    const createSysProfilePostsLog = new this.sys_profilePostsLogModel(createSysProfilePostsLogDTO)
    this.appLogger.info(this.createSysProfilePostsLog.name, 'saving createSysProfilePostsLog')
    await createSysProfilePostsLog.save()
  }

  async createSysTagPostsLog(createSysProfileLogINTF: ISys_executionLog): Promise<void>{
    const createSysTagPostsLogDTO = new CreateSysExecutionLogDTO(createSysProfileLogINTF)
    const createSysTagPostsLog = new this.sys_tagPostsLogModel(createSysTagPostsLogDTO)
    this.appLogger.info(this.createSysTagPostsLog.name, 'saving createSysTagPostsLog')
    await createSysTagPostsLog.save()
  }

  async createSysProfileCommentsLog(createSysProfileCommentsINTF: ISys_executionLog): Promise<void>{
    const createSysProfileCommentsDTO = new CreateSysExecutionLogDTO(createSysProfileCommentsINTF)
    const createSysProfileCommentsLog = new this.sys_profileCommentsLogModel(createSysProfileCommentsDTO)
    this.appLogger.info(this.createSysProfileCommentsLog.name, 'saving createSysProfileCommentsLog')
    await createSysProfileCommentsLog.save()
  }

  async createSysHashtagPostsLog(createSysHashtagPostsINTF: ISys_executionLog): Promise<void>{
    const createSysHashtagPostsDTO = new CreateSysExecutionLogDTO(createSysHashtagPostsINTF)
    const createSysHashtagPostsLog = new this.sys_hashtagPostsLogModel(createSysHashtagPostsDTO)
    this.appLogger.info(this.createSysHashtagPostsLog.name, 'saving createSysHashtagPostsLog')
    await createSysHashtagPostsLog.save()
  }
}