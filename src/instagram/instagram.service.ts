import { Injectable } from '@nestjs/common';
import { ExecutionState } from 'src/shared/constants/constants';
import { AppLoggerService } from 'src/shared/modules/app-logger/app-logger.service';
import { ProfilePostINTF } from 'src/shared/modules/database/interfaces/Profile/ProfilePost.intf';
import { ISys_executionLog } from 'src/shared/modules/database/interfaces/System/Sys_executionLog.intf';
import { asyncForEach, delay } from 'src/shared/utils/Utils';
import { AnalyzeHashtagSentimentINTF, AnalyzeMode, AnalyzeProfileSentimentINTF } from 'src/third-party-apis/Google/Sentiment/interfaces/AnalyzeSentiment.intf';
import { IClient } from 'src/users/database/interface/Client.intf';
import { UsersService } from 'src/users/users.service';
import { HashtagService } from './hashtag/hashtag.service';
import { ProfileService } from './profile/profile.service';

@Injectable()
export class InstagramService {
  private readonly appLogger = new AppLoggerService(InstagramService.name)
  constructor(
    private hashtagService: HashtagService, private profileService: ProfileService, private usersService: UsersService
  ){}

  //************ Hashtag **************//
  // async loadHashtagsData(): Promise<void>{
  //   try{
  //     const clients = await this.usersService.findClients()
  //     this.appLogger.info(this.loadHashtagsData.name, 'clients found: ' + clients?.length)
  //     await asyncForEach(clients, async (client: IClient) => {
  //                         // await Promise.all(clients.map(async (client) => {
  //       this.appLogger.info(this.loadHashtagsData.name, 'ForEach - In client: ' + client.name)
  //       await this.hashtagService.loadHashtagData({hashtag: client.ig_official_hashtag, client: client})
  //       const hashtagRivals = await this.hashtagService.getHashtagRivals(client.ig_official_hashtag)
  //       this.appLogger.info(this.loadHashtagsData.name, 'HashtagRivals found: ' + (hashtagRivals?.length || '0'))
  //                           // await Promise.all(hashtagRivals.map(async (hashtagRival) => {
  //       await asyncForEach(hashtagRivals, async (hashtagRival) => {
  //         await delay(60000)
  //         this.appLogger.info(this.loadHashtagsData.name, 'ForEach - In HashtagRival: ' + hashtagRival)
  //         await this.hashtagService.loadHashtagData({hashtag: hashtagRival, client: client, isLite: true})
  //       })
  //       await delay(3000)
  //     })
  //   }catch(e){ throw e }
  // }

  async hashtagsSentimentAnalyzeOG(): Promise<void>{
    try{
      const clients = await this.usersService.findClients()
      await asyncForEach(clients, async (client: IClient) => {
        const analyzeSentiment: AnalyzeHashtagSentimentINTF = {
          max_to_process: 50,
          // last_minutes: 20,
          // hashtag: client.ig_official_hashtag
        }
        await this.hashtagService.analyze_sentiment(analyzeSentiment)
        await delay(2000)
      })
    }catch(e){ throw e }
  }
  

  //******************* Profile ******************//
  //Clients
  // async ProfileData(): Promise<void>{
  //   try{
  //     const clients = await this.usersService.findClients()
  //     this.appLogger.info(this.ProfileData.name, 'clients found: ' + (clients?.length || 'null'))
  //     await asyncForEach(clients, async (client: IClient) => {
  //       this.appLogger.info(this.ProfileData.name, 'ForEach - In client: ' + client.name)
  //       await this.profileService.loadProfile(client.ig_official_profile.ig_id, client.ig_official_profile.username)
  //       await delay(3000)
  //     })
  //   }catch(err){
  //     this.appLogger.error(this.ProfileData.name, 'throwing error: ', err)
  //     throw err
  //   }
  // }
  
  //Influencers
  // async InfluencerProfileData(params: { onlyNews: boolean}): Promise<void>{
  //   const {onlyNews} = params
  //   try{
  //     const clients = await this.usersService.findClients()
  //     this.appLogger.info(this.ProfileData.name, 'clients found: ' + (clients?.length || 'null'))
  //     await asyncForEach(clients, async (client: IClient) => {
  //       this.appLogger.info(this.ProfileData.name, 'ForEach - In client: ' + client.name)
  //       await this.loadInfluencersProfiles({ hashtag: client.ig_official_hashtag, onlyNews: onlyNews})
  //       await delay(3000)
  //     })
  //   }catch(err){
  //     this.appLogger.error(this.ProfileData.name, 'throwing error: ', err)
  //     throw err
  //   }
  // }
  
  // Influencers
  // async loadInfluencersProfiles(params: {hashtag: string, onlyNews?: boolean}): Promise<void>{
  //   const {hashtag, onlyNews} = params
  //   try{
  //     const influencers = await this.profileService.getInfluencers({hashtag: hashtag, onlyNews: onlyNews || false})
  //     await asyncForEach(influencers, async (influencer) => {
  //       this.appLogger.info(this.loadInfluencersProfiles.name, 'Loading influencers profile for ' + influencer.ig_id)
  //       await this.profileService.loadInfluencerProfile(influencer.ig_id, '')
  //       await delay(15000)
  //     })
  //   }catch(e){ throw e}
  // }

  // async ProfilePostsData(): Promise<void>{
  //   try{
  //     const clients = await this.usersService.findClients()
  //     this.appLogger.info(this.ProfilePostsData.name, 'clients found: ' + (clients?.length || 'null'))
  //     await asyncForEach(clients, async (client: IClient) => {
  //       this.appLogger.info(this.ProfilePostsData.name, 'ForEach - In client: ' + client.name)
  //       await this.profileService.loadProfilePosts(client.ig_official_profile)
  //       await delay(5000)
  //     })
  //   }catch(err){ 
  //     this.appLogger.error(this.ProfilePostsData.name, '', err)
  //     throw err
  //   }
  // }

  // async ProfileCommentsData(): Promise<void>{
  //   try{
  //     const clients = await this.usersService.findClients()
  //     this.appLogger.info(this.ProfileCommentsData.name, 'clients found: ' + (clients?.length || 'null'))
  //     await asyncForEach(clients, async (client: IClient) => {
  //       this.appLogger.info(this.ProfileCommentsData.name, 'ForEach - In client: ' + client.name)
  //       const lastProfilePosts = await this.profileService.getProfilePosts({profile: client.ig_official_profile, lastPosts: true, max: 1})
  //       await asyncForEach(lastProfilePosts, async (profilePost: ProfilePostINTF) => {
  //         console.log('in post: ' + profilePost.shortcode)
  //         await this.profileService.loadProfileComments(profilePost)
  //       })
  //       await delay(5000)
  //     })
  //   }catch(err){ 
  //     this.appLogger.error(this.ProfileCommentsData.name, '', err)
  //     throw err
  //   }
  // }

  async ProfileFeedData(callsCounter: number): Promise<void>{
    try{
      const client = await this.usersService.findClient('ishopperu')
      this.appLogger.info(this.ProfileFeedData.name, 'Loading feed of client: ' + client.name)
      await this.profileService.loadProfilePosts(client.ig_official_profile, callsCounter)
    }catch(err){ 
      this.appLogger.error(this.ProfileFeedData.name, '', err)
      throw err
    }
  }


  //**************** Profiles Sentiment Analyze ******************/
  async profileSentimentAnalyze( client: IClient, mode: AnalyzeMode): Promise<void>{
    try{
      const analyzeSentiment: AnalyzeProfileSentimentINTF = {
        max_to_process: 50,
        _profile_id: client.ig_official_profile._id.toString(),
        analyze_mode: mode
        // last_minutes: 20,
      }
      await this.profileService.analyzeTextSentiment(analyzeSentiment)
    }catch(e){ throw e }
  }

  async findLastProfilePostStatsLog(): Promise<void> {
    await this.profileService.findLastProfilePostStatsLog('CV5VcDoJAd7')
  }


  /*********************************** NEW METHODS *****************************************/

  async loadProfileData(client: IClient): Promise<number>{
    try{
      const state = await this.profileService.loadProfile(client.ig_official_profile.ig_id, client.ig_official_profile.username)
      return state
    }catch(err){
      this.appLogger.error(this.loadProfileData.name, 'throwing error: ', err)
      return ExecutionState.ERROR_RESP_API
      // throw err
    }
  }


  async loadProfilePostsData(client: IClient): Promise<[number, number]>{
    try{
      this.appLogger.info(this.loadProfilePostsData.name, 'starting loadProfilePosts: ' + client.name)
      const [state, newPosts] = await this.profileService.loadProfilePosts(client.ig_official_profile, client.plan.profile_posts)
      return [state, newPosts]
    }catch(err){
      this.appLogger.error(this.loadProfilePostsData.name, '', err)
      return [ExecutionState.ERROR_RESP_API, 0]
      // throw err
    }
  }

  async loadTagPostsData(client: IClient): Promise<[number, number]>{
    try{
      this.appLogger.info(this.loadTagPostsData.name, 'starting loadTagPosts: ' + client.name)
      const [state, newPosts] = await this.profileService.loadTagPosts(client.ig_official_profile, client.plan.tag_posts)
      return [state, newPosts]
    }catch(err){
      this.appLogger.error(this.loadTagPostsData.name, '', err)
      return [ExecutionState.ERROR_RESP_API, 0]
      // throw err
    }
  }
  
  async loadProfileCommentsData(client: IClient, max: number, lastExecution: ISys_executionLog): Promise<[number, number]>{
    try{
      let remainingComments
      let _state = 0
      let _newComments = lastExecution.processedItems
      const lastProfilePosts = await this.profileService.getDBProfilePosts({profile: client.ig_official_profile, lastPosts: true, max: max})
      await asyncForEach(lastProfilePosts, async (profilePost: ProfilePostINTF) => {
        console.log('in post: ' + profilePost.shortcode)
        remainingComments = client.plan.profile_comments - _newComments
        console.log('remaining comments: ' + remainingComments)
        if(remainingComments > 0){
          const [state, newComments] = await this.profileService.loadProfileComments(profilePost, lastExecution.timestamp, remainingComments)
          _newComments = _newComments + newComments
          if(state != ExecutionState.OK) _state = state
        }
      })
      console.log('new comments: ' + _newComments)
      return [_state, _newComments]
    }catch(err){ 
      this.appLogger.error(this.loadProfileCommentsData.name, '', err)
      return [ExecutionState.ERROR_RESP_API, 0]
    }
  }

  async loadHashtagsData(client: IClient): Promise<[number, number]>{
    try{
      this.appLogger.info(this.loadHashtagsData.name, 'ForEach - In client: ' + client.name)
      const [state, newPosts] = await this.hashtagService.loadHashtagData({hashtag: client.ig_official_hashtag, client: client})
      const hashtagRivals = await this.hashtagService.getHashtagRivals(client.ig_official_hashtag)
      this.appLogger.info(this.loadHashtagsData.name, 'HashtagRivals found: ' + (hashtagRivals?.length || '0'))
          // await Promise.all(hashtagRivals.map(async (hashtagRival) => {
      await asyncForEach(hashtagRivals, async (hashtagRival) => {
        await delay(60000)
        this.appLogger.info(this.loadHashtagsData.name, 'ForEach - In HashtagRival: ' + hashtagRival)
        await this.hashtagService.loadHashtagData({hashtag: hashtagRival, client: client, isLite: true})
        await this.hashtagsSentimentAnalyze(hashtagRival)
      })
      await this.hashtagsSentimentAnalyze(client)
      return [state, newPosts]
    }catch(e){ throw e }
  }

  async InfluencerProfileData(params: { client: IClient, onlyNews: boolean}): Promise<void>{
    const {client, onlyNews} = params
    try{
      this.appLogger.info(this.InfluencerProfileData.name, 'starting InfluencerProfileData: ' + client.name)
      await this.loadInfluencersProfiles({ hashtag: client.ig_official_hashtag, onlyNews: onlyNews})
    }catch(err){
      this.appLogger.error(this.InfluencerProfileData.name, 'throwing error: ', err)
      throw err
    }
  }

  /******************************** PRIVATE FUNCTIONS *************************************/
  async hashtagsSentimentAnalyze(client: IClient | string): Promise<void>{
    const hashtag = (typeof client === 'string') ? client : client.ig_official_hashtag
    try{
      const analyzeSentiment: AnalyzeHashtagSentimentINTF = {
        max_to_process: 100,
        // last_minutes: 20,
        hashtag: hashtag
      }
      await this.hashtagService.analyze_sentiment(analyzeSentiment)
    }catch(e){ throw e }
  }

  async loadInfluencersProfiles(params: {hashtag: string, onlyNews?: boolean}): Promise<void>{
    const {hashtag, onlyNews} = params
    try{
      const influencers = await this.profileService.getInfluencers({hashtag: hashtag, onlyNews: onlyNews || false})
      await asyncForEach(influencers, async (influencer) => {
        this.appLogger.info(this.loadInfluencersProfiles.name, 'Loading influencers profile for ' + influencer.ig_id)
        await this.profileService.loadInfluencerProfile(influencer.ig_id, '')
        await delay(15000)
      })
    }catch(e){ throw e}
  }
}
