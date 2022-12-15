import { Injectable } from '@nestjs/common';
import { PsadbroHandler } from '../api-handler/concrete-handlers/Psadbro.handler'
import { KirtanHandler } from '../api-handler/concrete-handlers/Kirtan.handler'
import { CreateHashtagPostDTO } from '../../shared/modules/database/interfaces/Hashtag/dtos/CreateHashtagPost.dto'
import { HashtagLog } from './models/HashtagLog.model'
import { HashtagPost } from './models/HashtagPost.model'
import { HashtagData } from './models/HashtagData.model'
import { HashtagResponseDTO } from '../api-handler/interfaces/dtos/HashtagResponse.dto'
import { RawHashtagPosts } from  './models/RawHashtagPosts'
import { ApiHandlerService } from '../api-handler/api-handler.service'
import { HashtagPostINTF } from './interfaces/HashtagPost.intf';
import { Db_HashtagService } from 'src/shared/modules/database/db_hashtag.service';
import { AnalyzeHashtagSentimentINTF } from 'src/third-party-apis/Google/Sentiment/interfaces/AnalyzeSentiment.intf';
import { asyncForEach, diffDates, TimeOptions } from 'src/shared/utils/Utils';
import { HashtagRelationINTF } from 'src/shared/modules/database/interfaces/Hashtag/hashtagRelationLog.intf';
import { HashtagRelationLog } from './models/HashtagRelationLog.model';
import { SentimentService } from 'src/third-party-apis/Google/Sentiment/Sentiment.service';
import { HashtagRivalINTF } from 'src/shared/modules/database/interfaces/Hashtag/hashtagRival.intf';
import { AppLoggerService } from 'src/shared/modules/app-logger/app-logger.service';
import { ConfigService } from '@nestjs/config';
import { CloudStorageService } from 'src/third-party-apis/Google/cloud-storage/cloud-storage.service';
import { IInfluencer } from 'src/shared/modules/database/interfaces/Influencer/Influencer.intf';
import { DatabaseService } from 'src/shared/modules/database/database.service';
import { IClient } from 'src/users/database/interface/Client.intf';
import { MIN_LIKES_TO_BE_INFLUENCER } from 'src/shared/constants/instagram.constants';
import { PlaceDTO } from '../shared/interfaces/dtos/Place.dto';
import { PlaceINTF } from 'src/shared/modules/database/interfaces/Place/Place.intf';
import { ExecutionState } from 'src/shared/constants/constants';

@Injectable()
export class HashtagService {
  private readonly appLogger = new AppLoggerService(HashtagService.name)

  constructor(
    private psadbroHandler: PsadbroHandler, private yuananfHandler: KirtanHandler, 
    private apiHandlerService: ApiHandlerService, private db_hashtagService: Db_HashtagService, 
    private databaseService: DatabaseService, private sentimentService: SentimentService,
    private cloudStorageService: CloudStorageService, public configService: ConfigService,
  ){
    this.psadbroHandler.setNext(this.yuananfHandler)
  }


  // @Get('/load')
  async loadHashtagData(params: {hashtag: string, client: IClient, isLite?: boolean}): Promise<[number, number]>{
    const {hashtag, client, isLite} = params
    const hashtagData: HashtagData = await this.getHashtagData(hashtag)
    if(hashtagData){
      try{
        const hashtagLog: HashtagLog = hashtagData.hashtagLog
        const hashtagPosts: HashtagPost[] = hashtagData.hashtagPosts
        
        //Hashtag
        if(hashtagLog){
          await this.saveHashtag(hashtagLog)
          await this.createHashtagLog(hashtagLog)
        }
    
        //Posts
        // const existingPosts = await this.hashtagService.findHashtagPosts(hashtagPosts)
        // await this.updateTextSentiment({allPosts: hashtagPosts, existingPosts: existingPosts})
        await this.savePlaces(hashtagPosts)
        const newPosts = await this.saveHashtagPosts(hashtagPosts)
        
        //HashtagRelationLogs
        if(!isLite && newPosts && newPosts?.length > 0){
          await this.saveInfluencers(newPosts, client.ig_likesToBeInfluencer)
          // await this.uploadPostImages(newPosts)     //This functionality is ready to use
          this.appLogger.info(this.loadHashtagData.name, 'Hashtag ' + hashtag + ' - ' + 'new posts found: ' + (newPosts?.length || '0'))
          const hashtagRelations: HashtagRelationINTF[] = await this.getHashtagRelations({posts: newPosts, hashtagToExclude: hashtag})
          const hashtagRelationLog = new HashtagRelationLog({parent: hashtag, relations: hashtagRelations})
          await this.saveHashtagRelationLogs(hashtagRelationLog)
        }
        return [ExecutionState.OK, newPosts.length]
      }catch(err){
        this.appLogger.error(this.loadHashtagData.name, '', err)
        return [ExecutionState.ERROR_RESP_API, 0]
        // throw err
      }
    }else{
      return [ExecutionState.ERROR_RESP_API, 0]
      // throw new HttpException({
      //   status: HttpStatus.BAD_GATEWAY,
      //   error: 'Instagram API is not returning appropriate data',
      // }, HttpStatus.BAD_GATEWAY);
    }
  }

  // @Post('/analyze_sentiment')
  async analyze_sentiment(analyzeHashtagSentiment: AnalyzeHashtagSentimentINTF) : Promise<void>{
    try{
      let processedTexts = 0
      const unanalyzedPosts = await this.getSentimentUnanalyzedPosts(analyzeHashtagSentiment)
      await Promise.all(unanalyzedPosts.map(async (post) => {
        if(post?.text?.text){
          processedTexts++
          const textSentiment = await this.sentimentService.analyseTextSentiment(post.text.text)
          if(textSentiment){
            post.text = textSentiment
          }
          await this.db_hashtagService.updateHashtagPostText(post)
        }
      }))
      this.appLogger.info(this.analyze_sentiment.name, 'Total profile posts texts: ' + unanalyzedPosts.length + '. Analyzed: ' + processedTexts )
    }catch(e){ throw e }
  }

  async getHashtagRivals(hashtag: string): Promise<string[]>{
    try{
      const hashtagRivals: HashtagRivalINTF[] = await this.db_hashtagService.getHashtagRivals({hashtag: hashtag})
      const rivals = hashtagRivals?.map(hashtagRival => {return hashtagRival.rival.hashtag})
      return rivals || []
    }catch(e){
      throw e
    }
  }


  // -------------------------------------------------------------------------------
  // ------------------------------ Private functions ------------------------------
  // -------------------------------------------------------------------------------
  private getHashtagsInsideText(postText: string): string[]{
    const hashtagsInPostText: string[] = []
    let hashtagOccurrences: string[] = []
    const specialCharacters = /^[*?¿@!¡$%&()=+{},;:|-]/   //not add symbols after '-' symbol
    
    if(postText){
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
    }
    return hashtagsInPostText
  }

  private async createHashtagLog(hashtagLog: HashtagLog): Promise<void>{
    try{
      await this.db_hashtagService.createHashtagLog(hashtagLog.toCreateHashtagLogDTO())
    }catch(err){
      this.appLogger.error(this.createHashtagLog.name, '', err)
      throw err
    }
  }
  
  private async saveHashtag(hashtagLog: HashtagLog): Promise<void>{
    try{
      await this.db_hashtagService.upsertHashtag({hashtag: hashtagLog.toCreateHashtagLogDTO(), return_new: false})
    }catch(err){
      this.appLogger.error(this.saveHashtag.name, '', err)
      throw err
    }
  }

  private async saveHashtagPosts(hashtagPosts: HashtagPost[]): Promise<HashtagPostINTF[]>{
    const newHashtagPosts: HashtagPostINTF[] = []
    const hashtagPostsDTOs: CreateHashtagPostDTO[] = hashtagPosts.map(post => { return post.toCreateHashtagPostDTO() })
    try{
      const updatedOrCreatedPosts = await this.db_hashtagService.upsertHashtagPosts({hashtagPosts: hashtagPostsDTOs, return_news: true})
      updatedOrCreatedPosts.forEach(post => {
        const diffSeconds = diffDates({date_1: post.updatedAt, date_2: post.createdAt, options: TimeOptions.SECONDS})
        if(diffSeconds !== null && diffSeconds <= 1){ //post have been just inserted
          newHashtagPosts.push(post)
        }
      })
      return newHashtagPosts
    }catch(err){
      throw err
    }
  }
  
  private async getHashtagRelations(params: {posts: HashtagPostINTF[], hashtagToExclude?: string}): Promise<HashtagRelationINTF[]>{
    const hashtagsInPostsText = new Map<string, number>()
    params.posts?.forEach(async hashtagPost => {
      const hashtagsInsideText: string[] = this.getHashtagsInsideText(hashtagPost.text?.text)
      if(params.hashtagToExclude){
        const index = hashtagsInsideText.indexOf(params.hashtagToExclude);
        if (index !== -1) hashtagsInsideText.splice(index, 1);
      }
      hashtagsInsideText.forEach(hashtag => {
        const hashtagCounter = hashtagsInPostsText.get(hashtag) || 0
        hashtagsInPostsText.set(hashtag, hashtagCounter + 1)
      })
    })
    const hashtagRelations: HashtagRelationINTF[] = []
    hashtagsInPostsText.forEach(async (key, value) => {
      hashtagRelations.push({child: value, occurrences: key}) 
    })
    return hashtagRelations
  }

  private async saveHashtagRelationLogs(hashtagRelationLog: HashtagRelationLog): Promise<void>{
    try{
      const hashtagRelationLogDTO = hashtagRelationLog.toCreateHashtagRelationLogDTO()
      // await this.createHashtagRelationLog(hashtagRelationLogDTO)
      await this.db_hashtagService.createHashtagRelationLog(hashtagRelationLogDTO)
    }catch(err){
      console.error(err.message)
    }
  }

  private async uploadPostImages(newPosts: HashtagPostINTF[]): Promise<void> {
    await asyncForEach(newPosts, async (newPost: HashtagPostINTF) => {
      const {source_url, name } = newPost.image
      try{
        if(source_url?.length > 0){
          let command = `curl "{url}" | gsutil cp - gs://{bucket_name}/{directory_name}/{image_name}`
          const bucketName = this.configService.get<string>('GCS_BUCKET_NAME')
          const directoryName = this.configService.get<string>('GCS_HASHTAG_POST_PICS_DIRECTORY')

          command = command.replace('{url}', source_url).replace('{bucket_name}',bucketName)
                .replace('{directory_name}', directoryName).replace('{image_name}', name + '.jpg')
                       
          // console.info('executing command: ' + command)
          await this.cloudStorageService.storeFile_gsutil(command)
          this.appLogger.info(this.uploadPostImages.name, 'Uploaded file with name: ' + name)
        }
      }catch(e){
        this.appLogger.error(this.uploadPostImages.name, '', e)
        throw e
      }
    })
  }

  private async getHashtagData(hashtagName: string): Promise<HashtagData> {
    try{
      const hashtagResponseDTO: HashtagResponseDTO = await this.apiHandlerService.getHashtagData(hashtagName)
      if(hashtagResponseDTO){
        const rawHashtagPosts = new RawHashtagPosts({hashtagName: hashtagName, hashtagResponseDTO: hashtagResponseDTO})
        rawHashtagPosts.addTopPosts()
        rawHashtagPosts.addMediaPosts()
        this.appLogger.info(this.getHashtagData.name, 'Hashtag ' + hashtagName + ': ' + 'total posts found: ' + rawHashtagPosts.totalPostsSize + '\n' + 
          'media posts: ' + rawHashtagPosts.mediaPostsSize + ', ' + 'top posts: ' + rawHashtagPosts.topPostsSize)
  
        let hashtagLog = null
        if(hashtagResponseDTO.edge_hashtag_to_media.count){
          hashtagLog = new HashtagLog({
            hashtag: hashtagResponseDTO.name,
            profile_image_src: hashtagResponseDTO.profile_pic_url,
            posts: hashtagResponseDTO.edge_hashtag_to_media.count
          })
        }
  
        const hashtagPosts: HashtagPost[] = rawHashtagPosts.getAllPosts()
        return new HashtagData(hashtagLog, hashtagPosts)
      }
      return null
    }catch(err){ throw err }
  }

  private async getSentimentUnanalyzedPosts(reqAnalyzeHashtagSentiment: AnalyzeHashtagSentimentINTF): Promise<HashtagPostINTF[]>{
    const {hashtag, last_minutes, max_to_process} = reqAnalyzeHashtagSentiment
    try{
      let since_timestamp
      if(last_minutes){
        const _since_timestamp = new Date().getTime() - (last_minutes * 60000)
        since_timestamp = new Date(_since_timestamp)
      }
      const unanalyzedPosts = this.db_hashtagService.getUnanalyzedHashtagPosts({hashtag: hashtag, since_date: since_timestamp, limit: max_to_process})
      return unanalyzedPosts
    }catch(e){
      throw e
    }
  }

  private async saveInfluencers(newPosts: HashtagPostINTF[], likesToBeInfluencer: number): Promise<void>{
    newPosts = newPosts.filter(post => post.is_top == true || post.likes >= (likesToBeInfluencer || MIN_LIKES_TO_BE_INFLUENCER))
    await asyncForEach(newPosts, async (newPost: HashtagPostINTF) => {
      if(newPost.account_id){
        let influencer: IInfluencer = await this.databaseService.findInfluencer({ig_id: newPost.account_id})
        if(influencer){
          if(!influencer.clients_hashtags.includes(newPost.hashtag)){
            influencer.clients_hashtags.push(newPost.hashtag)
          }
        }else{
          influencer = { ig_id: newPost.account_id, clients_hashtags: [newPost.hashtag]}
        }
        await this.databaseService.upsertInfluencer(influencer)
      }
    })
  }

  private async savePlaces(hashtagPosts: HashtagPost[]): Promise<void>{
    await asyncForEach(hashtagPosts, async (hashtagPost: HashtagPost ) => {
      if(hashtagPost.location !== null && hashtagPost.location !== undefined){
        try{
          const placeIntf: PlaceINTF = {
            ig_id: hashtagPost.location.pk,
            facebook_places_id: hashtagPost.location.facebook_places_id,
            name: hashtagPost.location.name,
            longitude: hashtagPost.location.lng,
            latitude: hashtagPost.location.lat,
            address: hashtagPost.location.address,
            city: hashtagPost.location.city,
            short_name: hashtagPost.location.short_name
          }
          const placeDTO = new PlaceDTO(placeIntf)
          await this.databaseService.upsertPlace({place: placeDTO, return_new: false})
        }catch(err){
          this.appLogger.error(this.savePlaces.name, '', err)
          console.error(err.message)
          throw err
        }
      }
    })
  }  

}