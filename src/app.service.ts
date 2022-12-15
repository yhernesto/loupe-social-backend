import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InstagramService } from './instagram/instagram.service';
import { AppLoggerService } from './shared/modules/app-logger/app-logger.service';
import { DatabaseService } from './shared/modules/database/database.service';
import { WebFeeds_topicsINTF } from './shared/modules/database/interfaces/WebFeeds/webFeeds_topics.intf';
import { SystemService } from './shared/modules/system/system.service';

@Injectable()
export class AppService {
  private readonly appLogger = new AppLoggerService(AppService.name)
  constructor(
    private databaseService: DatabaseService,
    private instagramService: InstagramService,
    private systemService: SystemService,
  ){}

  async getGoogleNewsVariables(): Promise<WebFeeds_topicsINTF[]>{
    try{
      const googleNewsVariables= await this.databaseService.getWebFeeds_topics()
      return googleNewsVariables || [] as WebFeeds_topicsINTF[]
    }catch(e){
      throw e
    }
  }

  //********************************************************************/
  //**************************** INSTAGRAM *****************************/
  
  //Hashtag
  // @Cron('* */10 * * * *', { timeZone: 'America/Denver' })
  // @Cron('00 59 * * * *', { timeZone: 'America/Denver' })
  // async loadHashtagData(): Promise<void>{
  //   this.appLogger.notice(this.loadHashtagData.name, "*** starting 'loadHashtagData' cron each 10min ***")
  //   try{
  //     await this.instagramService.loadHashtagsData()
  //     this.appLogger.info(this.loadHashtagData.name, "*** ending 'loadHashtagData' cron ***")
  //   }catch(err){
  //     this.appLogger.error(this.loadHashtagData.name, 'error on loadHashtagData cron task', err)
  //     throw err
  //   }
  // }
  
  //Profile
  // @Cron('* */13 * * * *', { timeZone: 'America/Denver' })
  // @Cron('00 12 * * * *', { timeZone: 'America/Denver' })
  // async loadProfilesData(): Promise<void>{
  //   this.appLogger.notice(this.loadProfilesData.name, "*** starting 'loadProfileData' cron each 13min ***")
  //   try{
  //     await this.instagramService.ProfileData()
  //     this.appLogger.info(this.loadProfilesData.name, "*** ending 'loadProfileData' cron ***")
  //   }catch(err){
  //     this.appLogger.error(this.loadProfilesData.name, 'error on ProfileData cron task', err)
  //     throw err
  //   }
  // }  
  
  // Influencers  @TODO
  // @Cron('* */13 * * * *', { timeZone: 'America/Denver' })
  // @Cron('00 13 * * * *', { timeZone: 'America/Denver' })
  // async loadInfluencersProfilesData(): Promise<void>{
  //   this.appLogger.notice(this.loadInfluencersProfilesData.name, "*** starting 'loadInfluencersProfilesData' cron each 13min ***")
  //   try{
  //     await this.instagramService.InfluencerProfileData({onlyNews: true})
  //     this.appLogger.info(this.loadInfluencersProfilesData.name, "*** ending 'loadInfluencersProfilesData' cron ***")
  //   }catch(err){
  //     this.appLogger.error(this.loadInfluencersProfilesData.name, 'error on loadInfluencersProfilesData cron task', err)
  //     throw err
  //   }
  // }
  
  // @Cron('* */14 * * * *', { timeZone: 'America/Denver' })
  // @Cron('00 09 * * * *', { timeZone: 'America/Denver' })
  // async loadProfilePostsData(): Promise<void>{
  //   this.appLogger.notice(this.loadProfilePostsData.name, "*** starting 'loadProfilePostsData' cron each 14min ***")
  //   try{
  //     await this.instagramService.ProfilePostsData()
  //     this.appLogger.info(this.loadProfilePostsData.name, "*** ending 'loadProfilePostsData' cron ***")
  //   }catch(err){ 
  //     this.appLogger.error(this.loadProfilePostsData.name, 'error on loadProfilePostsData cron task', err)  
  //     throw err 
  //   }
  // }
  
  // @Cron('* */14 * * * *', { timeZone: 'America/Denver' })
  // @Cron('00 11 * * * *', { timeZone: 'America/Denver' })
  // async loadProfileCommentsData(): Promise<void>{
  //   this.appLogger.notice(this.loadProfileCommentsData.name, "*** starting 'loadProfileCommentsData' cron each 14min ***")
  //   try{
  //     await this.instagramService.ProfileCommentsData()
  //     this.appLogger.info(this.loadProfileCommentsData.name, "*** ending 'loadProfileCommentsData' cron ***")
  //   }catch(err){ 
  //     this.appLogger.error(this.loadProfileCommentsData.name, 'error on loadProfileCommentsData cron task', err)  
  //     throw err 
  //   }
  // }
  
  // @Cron('* */14 * * * *', { timeZone: 'America/Denver' })
  // @Cron('00 41 * * * *', { timeZone: 'America/Denver' })
  // async loadProfileFeedData(): Promise<void>{
  //   this.appLogger.notice(this.loadProfileFeedData.name, "*** starting 'loadProfileFeedData' cron each 14min ***")
  //   try{
  //     await this.instagramService.ProfileFeedData(5)
  //     this.appLogger.info(this.loadProfileFeedData.name, "*** ending 'loadProfileFeedData' cron ***")
  //   }catch(err){ 
  //     this.appLogger.error(this.loadProfileFeedData.name, 'error on loadProfileFeedData cron task', err)  
  //     throw err 
  //   }
  // }

  // //Text Sentiment
  // @Cron('00 31 * * * *', { timeZone: 'America/Denver' })
  // async analyzeProfileTextSentiment(): Promise<void>{
  //   this.appLogger.notice(this.analyzeProfileTextSentiment.name, "**** starting 'ProfileTextSentiment' cron each 26min")
  //   try{
  //     await this.instagramService.profilesSentimentAnalyze()
  //     this.appLogger.notice(this.analyzeProfileTextSentiment.name, "**** ending 'ProfileTextSentiment' ****")
  //   }catch(e){ throw e }
  // }
  
  // @Cron('*/28 * * * * *', { timeZone: 'America/Denver' })
  // @Cron('00 56 * * * *', { timeZone: 'America/Denver' })
  // async analyzeHashtagTextSentiment(): Promise<void>{
  //   try{
  //     await this.instagramService.hashtagsSentimentAnalyzeOG()
  //     this.appLogger.notice(this.analyzeHashtagTextSentiment.name, "**** ending HashtagTextSentiment' ****")
  //   }catch(e){ throw e }
  // }



  /************************************* NEWS CHECKS *********************************/
  // @Cron('00 48 * * * *', { timeZone: 'America/Denver' })
  async checkProfileLogs(): Promise<void>{
    this.appLogger.notice(this.checkProfileLogs.name, "*** starting 'checkProfileLogs' cron each 13min ***")
    try{
      await this.systemService.loadProfilesData()
      this.appLogger.notice(this.checkProfileLogs.name, "**** ending Sys Profile Log ****")
    }catch(err){ throw err }
  }

  // @Cron('00 51 * * * *', { timeZone: 'America/Denver' })
  async checkProfilePostsLogs(): Promise<void>{
    this.appLogger.notice(this.checkProfilePostsLogs.name, "*** starting 'checkProfilePostsLogs' cron each 13min ***")
    try{
      await this.systemService.loadProfilesPostsData()
      this.appLogger.notice(this.checkProfilePostsLogs.name, "**** ending Sys Profile Posts Log ****")
    }catch(err){ throw err }
  }

  // @Cron('00 43 * * * *', { timeZone: 'America/Denver' })
  async checkTagPostsLogs(): Promise<void>{
    this.appLogger.notice(this.checkTagPostsLogs.name, "*** starting 'checkTagPostsLogs' cron each 13min ***")
    try{
      await this.systemService.loadTagPostsData()
      this.appLogger.notice(this.checkTagPostsLogs.name, "**** ending Sys Tag Posts Log ****")
    }catch(err){ throw err }
  }


  // @Cron('00 53 * * * *', { timeZone: 'America/Denver' })
  async checkProfileComments(): Promise<void>{
    this.appLogger.notice(this.checkProfileComments.name, "*** starting 'checkProfileComments' cron each 13min ***")
    try{
      await this.systemService.ProfileCommentsData()
      this.appLogger.info(this.checkProfileComments.name, "*** ending 'checkProfileComments' cron ***")
    }catch(err){
      this.appLogger.error(this.checkProfileComments.name, "error on 'checkProfileComments' cron task", err)
      throw err
    }
  }
  
  // @Cron('00 44 * * * *', { timeZone: 'America/Denver' })
  async checkHashtagPostsLogs(): Promise<void>{
    this.appLogger.notice(this.checkHashtagPostsLogs.name, "*** starting 'checkHashtagPostsLogs' cron each 13min ***")
    try{
      await this.systemService.loadHashtagsPostsData()
      this.appLogger.notice(this.checkHashtagPostsLogs.name, "**** ending Sys HashtagPostsLog ****")
    }catch(err){      
      this.appLogger.error(this.checkInfluencersProfiles.name, "error on 'checkHashtagPostsLogs' cron task", err)
      throw err
    }
  }

  // @Cron('00 30 * * * *', { timeZone: 'America/Denver' })
  async checkInfluencersProfiles(): Promise<void>{
    this.appLogger.notice(this.checkInfluencersProfiles.name, "*** starting 'checkInfluencersProfiles' cron each 13min ***")
    try{
      await this.systemService.InfluencerProfileData()
      this.appLogger.info(this.checkInfluencersProfiles.name, "*** ending 'checkInfluencersProfiles' cron ***")
    }catch(err){
      this.appLogger.error(this.checkInfluencersProfiles.name, "error on 'checkInfluencersProfiles' cron task", err)
      throw err
    }
  }
}