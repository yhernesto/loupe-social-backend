import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PsadbroHandler } from '../api-handler/concrete-handlers/Psadbro.handler'
import { KirtanHandler } from '../api-handler/concrete-handlers/Kirtan.handler'
import { ApiHandlerService } from '../api-handler/api-handler.service'
import { ProfileResponseDTO } from '../api-handler/interfaces/dtos/ProfileResponse.dto';
import { Profile } from './models/profile.model'
import { CreateProfileDTO } from '../../shared/modules/database/interfaces/Profile/dtos/CreateProfile.dto'
import { CreateProfileStatsLogDTO } from '../../shared/modules/database/interfaces/Profile/dtos/CreateProfileStatsLog.dto'
import { ProfileINTF as CreateProfileINTF } from '../../shared/modules/database/interfaces/Profile/Profile.intf'
import { ProfileINTF } from '../shared/interfaces/dtos/Profile.dto'
import { ProfileStatsLogINTF as CreateProfileStatsLogINTF } from '../../shared/modules/database/interfaces/Profile/ProfileStatsLog.intf'
import { DatabaseService } from 'src/shared/modules/database/database.service';
import { db_ProfileService as DB_profileService } from 'src/shared/modules/database/db_profile.service';
import { PostsResponseDTO } from './interfaces/dtos/PostsResponse.dto'
import { Post as ProfilePost } from './models/Posts.model'
import { Post as TagPost } from './models/Posts.model'
import { PostResponseINTF } from './interfaces/PostResponse.intf';
import { CreateTagINTF } from '../../shared/modules/database/interfaces/Tag/createTag.intf'
import { CreateTagDTO } from '../../shared/modules/database/interfaces/Tag/dtos/CreateTag.dto'
import { PlaceDTO } from '../shared/interfaces/dtos/Place.dto';
import { PlaceINTF} from 'src/shared/modules/database/interfaces/Place/Place.intf';
import { CommentDTO as CreateCommentDTO } from '../../shared/modules/database/interfaces/Comments/dtos/CreateComment.dto'
// import { CommentINTF } from '../../shared/modules/database/interfaces/Comments/comment.intf'
import { ProfilePostDTO as CreateProfilePostDTO } from 'src/shared/modules/database/interfaces/Profile/dtos/CreateProfilePost.dto';
import { TagPostDTO as CreateTagPostDTO } from 'src/shared/modules/database/interfaces/Profile/dtos/CreateTagPost.dto';
import { ProfilePostINTF as ICreateProfilePost} from 'src/shared/modules/database/interfaces/Profile/ProfilePost.intf';
import { TagPostINTF as ICreateTagPost} from 'src/shared/modules/database/interfaces/Profile/TagPost.intf';
import { CommentINTF as CreateCommentINTF } from 'src/shared/modules/database/interfaces/Comments/comment.intf'
import { IProfilePostStatsLog } from 'src/shared/modules/database/interfaces/Profile/ProfilePostStatsLog.intf'
import { CreateProfilePostStatsLogDTO } from 'src/shared/modules/database/interfaces/Profile/dtos/CreateProfilePostStatLog.dto'
import { asyncForEach, hasValues, TimeOptions, timestampConverter } from 'src/shared/utils/Utils';
import { AnalyzeProfileSentimentDTO } from 'src/third-party-apis/Google/Sentiment/interfaces/dtos/AnalyzeProfileSentiment.dto';
import { CloudStorageService } from 'src/third-party-apis/Google/cloud-storage/cloud-storage.service';
import { ConfigService } from '@nestjs/config';
import { IImage } from '../shared/interfaces/dtos/Image.intf';
import { AnalyzeMode, AnalyzeProfileSentimentINTF } from 'src/third-party-apis/Google/Sentiment/interfaces/AnalyzeSentiment.intf';
import { SentimentService } from 'src/third-party-apis/Google/Sentiment/Sentiment.service';
import { AppLoggerService } from 'src/shared/modules/app-logger/app-logger.service';
import { IInfluencer } from 'src/shared/modules/database/interfaces/Influencer/Influencer.intf';
import { ProfilePostsResponseDTO } from '../api-handler/interfaces/dtos/ProfilePostsResponse.dto';
import { ProfilePostINTF as IApiHdlrProfilePost} from '../api-handler/interfaces/ProfilePost.intf';
import { ITagPost as IApiHdlrTagPost} from '../api-handler/interfaces/TagPost.intf';
import { IPostComment, IPostCommentsResponse as IProfileComments } from '../api-handler/interfaces/dtos/PostCommentsResponse.dto';
import { commentINTFFromResponse } from './models/Comment.model';
import { IComment } from '../shared/interfaces/Comment.intf';
import { Comment } from './models/Comment.model';
import { ExecutionState } from 'src/shared/constants/constants';
import { TagResponseDTO } from '../api-handler/interfaces/dtos/Kirtan/KirtanTagResponse.dto';
import { ITagResponse } from './interfaces/TagResponse.intf';


@Injectable()
export class ProfileService {
  private readonly appLogger = new AppLoggerService(ProfileService.name)

  constructor(private psadbroHandler: PsadbroHandler, private kirtanHandler: KirtanHandler, 
    private apiHandlerService: ApiHandlerService, private databaseService: DatabaseService, 
    private db_profileService: DB_profileService, private cloudStorageService: CloudStorageService, 
    public configService: ConfigService, private sentimentService: SentimentService){
    this.psadbroHandler.setNext(this.kirtanHandler)
  }

  async loadProfile(user_id: number, username: string): Promise<number>{
    const profile: Profile = await this.getProfileData(user_id, username);
    if(profile){
      const sourcedProfile = await profile.getCreateProfileINTF()
      const sourcedProfileStatsLog = profile.getCreateProfileStatsLogINTF()
      const savedProfile = await this.db_profileService.findProfile({profile_id: profile.ig_id})
      let newPictureMustBeTaken = false
      if(savedProfile){
        sourcedProfile._id = savedProfile._id
        // newPictureMustBeTaken = this.newPictureMustBeTaken(savedProfile, sourcedProfile)
        if(!newPictureMustBeTaken) { sourcedProfile.profile_pic  = savedProfile.profile_pic }
        await this.updateProfile(sourcedProfile)
      }else{
        // newPictureMustBeTaken = true      //active this when upload profile posts images where needed
        newPictureMustBeTaken = false
        await this.createProfile(sourcedProfile)   //insert profile
      }
      if(newPictureMustBeTaken){ await this.uploadProfilePic(sourcedProfile.profile_pic) }
      if(newPictureMustBeTaken){ sourcedProfileStatsLog.profile_pic = sourcedProfile.profile_pic }
      await this.createProfileStatsLog(sourcedProfileStatsLog)
      return ExecutionState.OK
    }else{
      return ExecutionState.ERROR_RESP_API
      // throw new HttpException({
      //   status: HttpStatus.BAD_GATEWAY,
      //   error: 'Instagram API is not returning appropriate data',
      // }, HttpStatus.BAD_GATEWAY);
    }
  }

  async loadInfluencerProfile(user_id: number, username: string): Promise<void>{
    const profile: Profile = await this.getProfileData(user_id, username);
    if(profile){
      const sourcedProfile = await profile.getCreateProfileINTF()
      sourcedProfile.profile_pic.name = sourcedProfile.ig_id.toString()  //Influencer pictures are overwritten
      const savedProfile = await this.db_profileService.findProfile({profile_id: profile.ig_id})
      let newPictureMustBeTaken = false
      if(savedProfile){
        sourcedProfile._id = savedProfile._id
        // newPictureMustBeTaken = this.newPictureMustBeTaken(savedProfile, sourcedProfile)
        if(!newPictureMustBeTaken) { sourcedProfile.profile_pic  = savedProfile.profile_pic }
        await this.updateProfile(sourcedProfile)
      }else{
        // newPictureMustBeTaken = true
        newPictureMustBeTaken = false
        const newProfile = await this.createProfile(sourcedProfile)
        await this.databaseService.updateInfluencer({ig_id: user_id, profile: newProfile})   //insert profile
      }
      if(newPictureMustBeTaken){ await this.uploadProfilePic(sourcedProfile.profile_pic) }
    }else{
      throw new HttpException({
        status: HttpStatus.BAD_GATEWAY,
        error: 'Instagram API is not returning appropriate data',
      }, HttpStatus.BAD_GATEWAY);
    }
  }

  async loadProfilePosts(profile: ProfileINTF, maxNewPosts: number, callsCounter?: number): Promise<[number, number]>{
    try{
      const profilePosts: ProfilePost[] = await this.getProfilePostsData(profile.username, callsCounter);
      let newPosts = 0
      if(profilePosts){
        this.appLogger.info(this.loadProfilePosts.name, 'Posts found: ' + profilePosts.length)
        await asyncForEach(profilePosts, async (post: ProfilePost) => {
          if(newPosts > maxNewPosts){
            this.appLogger.info(this.loadProfilePosts.name, 'Max profile ' + maxNewPosts + ' posts reached for client')
            return
          }
          this.appLogger.info(this.loadProfilePosts.name, 'ForEach - In post: ' + post.shortcode)
          await this.saveProfile(post.profile)
          const place: PlaceINTF = await this.savePlace(post.place)
          this.appLogger.info(this.loadProfilePosts.name, 'Post ' + post.shortcode + ' - tags found: ' + (post.usertags?.length || '0'))
          await asyncForEach(post.usertags, async tag => {
            const taggedUser = await this.saveProfile(tag.user_tagged) 
            this.appLogger.info(this.loadProfilePosts.name, 'Post ' + post.shortcode + ' - saving user tagged: ', taggedUser)
            const createTagINTF: CreateTagINTF = {
              post_shortcode: tag.tag.post_shortcode,
              owner_id: profile._id,
              tagged_id: taggedUser._id,
              position: tag.tag.position,
              video: tag.tag.video
            }
            await this.saveTag(createTagINTF)
          })

          //save profile post
          const oldPostImage = await this.getOldPostImage(post.shortcode)
          const createProfilePostINTF = await post.getCreateProfilePostINTF({profile_id: profile._id, place_id: place._id, old_post_img: oldPostImage})
          if(!oldPostImage){ this.uploadPostPic(createProfilePostINTF.image) }    // is a new post
          await this.createProfilePostStatLog(createProfilePostINTF)
          await this.saveProfilePost(createProfilePostINTF)
    
          //create comments
          this.appLogger.info(this.loadProfilePosts.name, 'Post ' + post.shortcode + ' - comments found: ' + post.comments?.length || '0')
          post.comments?.forEach(async (comment: Comment) => {
            const createCommentINTF = comment.toCreateCommentINTF(profile._id)
            await this.saveComment(createCommentINTF)
          })
          if(!oldPostImage) newPosts++
        })
        return [ExecutionState.OK, newPosts]
      }else{
        return [ExecutionState.ERROR_RESP_API, newPosts]
        // throw new HttpException({
        //   status: HttpStatus.BAD_GATEWAY,
        //   error: 'Instagram API is not returning appropriate data',
        // }, HttpStatus.BAD_GATEWAY);
      }
    }catch(err){
      this.appLogger.error(this.loadProfilePosts.name, '', err)
      return [ExecutionState.ERROR_RESP_API, 0]
    }
  }

  async analyzeTextSentiment(analyzeProfileSentimentDTO: AnalyzeProfileSentimentDTO) : Promise<string>{
    let apiResponseInformation
    try{
      if(analyzeProfileSentimentDTO.analyze_mode === AnalyzeMode.CAPTION || analyzeProfileSentimentDTO.analyze_mode === AnalyzeMode.CAPTION_COMMENTS_TAGS){
        apiResponseInformation = await this.analyzeProfilePostSentiment(analyzeProfileSentimentDTO)
      }
      if(analyzeProfileSentimentDTO.analyze_mode === AnalyzeMode.COMMENTS || analyzeProfileSentimentDTO.analyze_mode === AnalyzeMode.CAPTION_COMMENTS_TAGS){
        apiResponseInformation = await this.analyzeCommentSentiment(analyzeProfileSentimentDTO)
      }
      if(analyzeProfileSentimentDTO.analyze_mode === AnalyzeMode.TAGS || analyzeProfileSentimentDTO.analyze_mode === AnalyzeMode.CAPTION_COMMENTS_TAGS){
        apiResponseInformation = await this.analyzeTagSentiment(analyzeProfileSentimentDTO)
      }
      return apiResponseInformation
    }catch(err){ throw err }
  }

  async getInfluencers(params: {hashtag: string, onlyNews: boolean}): Promise<IInfluencer[]>{
    const {hashtag, onlyNews} = params
    try{
      if(onlyNews){
        return await this.databaseService.findInfluencers({profile: null, clients_hashtags: hashtag})
      }else{
        return await this.databaseService.findInfluencers({clients_hashtags: hashtag})
      }
    }catch(e){ throw e}
  }

  async loadProfileComments(profilePost: ICreateProfilePost, lastExecution: number, remainingComments: number): Promise<[number, number]>{
    try{
      let newComments = 0
      lastExecution = timestampConverter(lastExecution, TimeOptions.SECONDS)
      const comments: Comment[] = await this.getProfileCommentsData(profilePost.ig_id, profilePost.shortcode)
      console.log('comments found: ' + comments.length)
      await asyncForEach(comments, async (comment: Comment) => {
        if(remainingComments >= newComments){
          const createCommentINTF = comment.toCreateCommentINTF(profilePost._profile_id)
          const createComment: CreateCommentDTO = new CreateCommentDTO(createCommentINTF)
          await this.db_profileService.upsertComment({comment: createComment, return_new: false})
          console.log('taken_at: ' + comment.taken_at + ' - lastExecution: ' + lastExecution)
          if(comment.taken_at >= lastExecution) newComments++ 
        }
      })
      return [ExecutionState.OK, newComments]
    }catch(err){
      this.appLogger.error(this.loadProfileComments.name, '', err)
      throw err 
    }
  }

  // -------------------------------------- TAG ------------------------------------------------//
  async loadTagPosts(profile: ProfileINTF, maxNewPosts: number): Promise<[number, number]>{
    try{
      const tagPosts: TagPost[] = await this.getTagPostsData(profile.username);
      let newPosts = 0
      if(tagPosts){
        this.appLogger.info(this.loadTagPosts.name, 'Tagged posts found: ' + tagPosts.length)
        await asyncForEach(tagPosts, async (post: ProfilePost) => {
          if(newPosts > maxNewPosts){
            this.appLogger.info(this.loadTagPosts.name, 'Max profile ' + maxNewPosts + ' posts reached for client')
            return
          }
          this.appLogger.info(this.loadTagPosts.name, 'ForEach - In post: ' + post.shortcode)
          await this.saveProfile(post.profile)
          const place: PlaceINTF = await this.savePlace(post.place)
          this.appLogger.info(this.loadTagPosts.name, 'Post ' + post.shortcode + ' - tags found: ' + (post.usertags?.length || '0'))
          await asyncForEach(post.usertags, async tag => {
            const taggedUser = await this.saveProfile(tag.user_tagged)
            this.appLogger.info(this.loadTagPosts.name, 'Post ' + post.shortcode + ' - saving user tagged: ', taggedUser)
            const createTagINTF: CreateTagINTF = {
              post_shortcode: tag.tag.post_shortcode,
              owner_id: profile._id,
              tagged_id: taggedUser._id,
              position: tag.tag.position,
              video: tag.tag.video
            }
            await this.saveTag(createTagINTF)
          })

          //save profile post
          const oldPostImage = await this.getOldPostImage(post.shortcode)
          const createTagPostINTF = await post.getCreateProfilePostINTF({profile_id: profile._id, place_id: place._id, old_post_img: oldPostImage})
          //if(!oldPostImage){ this.uploadPostPic(createTagPostINTF.image) }    // is a new post
          //await this.createProfilePostStatLog(createTagPostINTF)
          await this.saveTagPost(createTagPostINTF)
    
          //create comments
          this.appLogger.info(this.loadTagPosts.name, 'Post ' + post.shortcode + ' - comments found: ' + post.comments?.length || '0')
          post.comments?.forEach(async (comment: Comment) => {
            const createCommentINTF = comment.toCreateCommentINTF(profile._id)
            await this.saveComment(createCommentINTF)
          })
          if(!oldPostImage) newPosts++
        })
        return [ExecutionState.OK, newPosts]
      }else{
        return [ExecutionState.ERROR_RESP_API, newPosts]
        // throw new HttpException({
        //   status: HttpStatus.BAD_GATEWAY,
        //   error: 'Instagram API is not returning appropriate data',
        // }, HttpStatus.BAD_GATEWAY);
      }
    }catch(err){
      this.appLogger.error(this.loadTagPosts.name, '', err)
      return [ExecutionState.ERROR_RESP_API, 0]
    }
  }

  // -----------------------------------------------------------------------------------------//
  // ------------------------------------ PRIVATE METHODS ------------------------------------//

  // ---------------------------- Posts Stats Log ----------------------------

  private async createProfilePostStatLog(createProfilePostINTF: ICreateProfilePost): Promise<void>{
    try{
        const lastProfilePostStatLog = await this.db_profileService.findLastProfilePostStatsLog(createProfilePostINTF.shortcode)
        const createProfilePostStatLog: IProfilePostStatsLog = {
          _profile_id: createProfilePostINTF._profile_id,
          post_shortcode: createProfilePostINTF.shortcode,
          comments: createProfilePostINTF.comments_count,
          lastComments: lastProfilePostStatLog?.comments,
          likes: createProfilePostINTF.likes_count,
          lastLikes: lastProfilePostStatLog?.likes
        }
        const profilePostStatsLogDTO = new CreateProfilePostStatsLogDTO(createProfilePostStatLog)
        await this.db_profileService.createProfilePostStatsLog(profilePostStatsLogDTO)
      // }
    }catch(err){
      throw err
    }
  }

  async findLastProfilePostStatsLog(shortcode: string): Promise<void>{
    try{
      await this.db_profileService.findLastProfilePostStatsLog(shortcode)
    }catch(err){ throw err }
  }

  private async analyzeCommentSentiment(analyzeProfileSentiment: AnalyzeProfileSentimentINTF): Promise<void>{
    let processedTexts = 0
    const unanalyzedComments = await this.getSentimentUnanalyzedComments(analyzeProfileSentiment)
    unanalyzedComments.forEach(p=>{console.info(p)})
    await Promise.all(unanalyzedComments.map(async (comment) => {
      if(comment.text.text !== ""){
        processedTexts++
        const textSentiment = await this.sentimentService.analyseTextSentiment(comment.text.text)
        if(textSentiment){
          comment.text = textSentiment
        }
        await this.db_profileService.updateCommentText(comment)
      }
    }))
    this.appLogger.info(this.analyzeCommentSentiment.name, 'Total profile posts texts: ' + unanalyzedComments.length + '. Analyzed: ' + processedTexts )
  }

  private async analyzeProfilePostSentiment(analyzeProfileSentiment: AnalyzeProfileSentimentINTF): Promise<void>{
    let processedTexts = 0
    try{
      const unanalyzedPosts = await this.getSentimentUnanalyzedPosts(analyzeProfileSentiment)
      await Promise.all(unanalyzedPosts.map(async (post) => {
        if(post?.text?.text){
          processedTexts++
          const textSentiment = await this.sentimentService.analyseTextSentiment(post.text.text)
          if(textSentiment){
            post.text = textSentiment
          }
          await this.db_profileService.updateProfilePostText(post)
        }
      }))
      this.appLogger.info(this.analyzeProfilePostSentiment.name, 'Total profile posts texts: ' + unanalyzedPosts.length + '. Analyzed: ' + processedTexts )
    }catch(e){ throw e }
  }

  private async analyzeTagSentiment(analyzeProfileSentiment: AnalyzeProfileSentimentINTF): Promise<void>{
    let processedTexts = 0
    const unanalyzedTagPosts = await this.getSentimentUnanalyzedTags(analyzeProfileSentiment)
    await Promise.all(unanalyzedTagPosts.map(async (tagPost) => {
      if(tagPost.text.text !== ""){
        processedTexts++
        const textSentiment = await this.sentimentService.analyseTextSentiment(tagPost.text.text)
        if(textSentiment){
          tagPost.text = textSentiment
        }
        await this.db_profileService.updateTagPostText(tagPost)
      }
    }))
    this.appLogger.info(this.analyzeCommentSentiment.name, 'Total tagged posts texts: ' + unanalyzedTagPosts.length + '. Analyzed: ' + processedTexts )
  }

  private newPictureMustBeTaken(savedProfile: ProfileINTF, newProfile: ProfileINTF): boolean {
    if(!savedProfile.profile_pic?.hash){
      return true
    }
    if(newProfile.profile_pic?.hash){
      if(savedProfile.profile_pic.hash === newProfile.profile_pic.hash){
        return false
      }
      return true
    }
    return false
  }

  private async getOldPostImage(shortcode: string): Promise<any>{
    const savedPost = await this.findProfilePost(shortcode)
    if(savedPost?.image?.source_url){
      return savedPost.image
    }
    return null
  }


  private async createProfile(createProfileINTF: CreateProfileINTF): Promise<ProfileINTF>{
    try{
      const createProfileDTO: CreateProfileDTO = new CreateProfileDTO(createProfileINTF)
      const profile = await this.db_profileService.upsertProfile({profile: createProfileDTO, return_new: true})
      // const profile = await this.databaseService.createProfile(createProfileDTO)
      return profile
    }catch(err){
      console.error(err.message)
    }
  }

  private async updateProfile(updateProfileINTF: CreateProfileINTF): Promise<void>{
    try{
      const updateProfileDTO = new CreateProfileDTO(updateProfileINTF)
      //upload pic to google bucket
      await this.db_profileService.updateProfile(updateProfileDTO)
    }catch(err){
      console.error(err.message)
    }
  }

  private async uploadProfilePic(profilePic: IImage): Promise<void>{
    const directoryName = this.configService.get<string>('GCS_PROFILE_PICS_DIRECTORY')
    await this.uploadImage(profilePic, directoryName)
  }

  private async uploadPostPic(profilePic: IImage): Promise<void>{
    const directoryName = this.configService.get<string>('GCS_PROFILE_POST_PICS_DIRECTORY')
    // await this.uploadImage(profilePic, directoryName)
  }

  private async uploadImage(profilePic: IImage, directoryName: string): Promise<void>{
    const {source_url, name } = profilePic
    try{
      if(source_url?.length > 0){
        let command = `curl "{url}" | gsutil cp - gs://{bucket_name}/{directory_name}/{image_name}`
        const bucketName = this.configService.get<string>('GCS_BUCKET_NAME')

        command = command.replace('{url}', source_url).replace('{bucket_name}',bucketName)
              .replace('{directory_name}', directoryName).replace('{image_name}', name + '.jpg')
                     
        // console.info('executing command: ' + command)
        await this.cloudStorageService.storeFile_gsutil(command)
        this.appLogger.info(this.uploadImage.name, 'Uploaded file with name: ' + name)
      }
    }catch(e){
      this.appLogger.error(this.uploadImage.name, '', e)    
      throw e
    }
  }

  // async findProfileByIGId(profile_ig_id: number): Promise<ProfileINTF>{
  //   try{
  //     const profile = await this.db_profileService.findProfile({profile_id: profile_ig_id})
  //     return profile
  //   }catch(err){
  //     console.error(err.message)
  //   }
  // }

  private async saveProfile(createProfileINTF: CreateProfileINTF): Promise<ProfileINTF>{
    try{
      const createProfileDTO: CreateProfileDTO = new CreateProfileDTO(createProfileINTF)
      const profile = await this.db_profileService.upsertProfile({profile: createProfileDTO, return_new: true})
      return profile
    }catch(err){
      console.error(err.message)
    }
  }

  private async createProfileStatsLog(createProfileStatsLogINTF: CreateProfileStatsLogINTF): Promise<void>{
    if(hasValues(createProfileStatsLogINTF)){
      try{
        const profileStatsLogDTO: CreateProfileStatsLogDTO = new CreateProfileStatsLogDTO(createProfileStatsLogINTF)
        await this.db_profileService.createProfileStatsLog(profileStatsLogDTO)
      }catch(err){
        console.error(err.message)
      }
    }
  }

  // ------------------------------ Tag ------------------------------------

  private async saveTag(createTagINTF: CreateTagINTF): Promise<CreateTagINTF>{
    try{
      const tagDTO = new CreateTagDTO(createTagINTF)
      const tag = await this.db_profileService.upsertTag({tag: tagDTO, return_new: true})
      return tag
    }catch(err){
      this.appLogger.error(this.saveTag.name, '', err)
      throw err
    }
  }  
 
  // ------------------------------- Rapid API Posts -----------------------------------

  private async getProfilePostsData(username: string, callsCounter?: number): Promise<ProfilePost[]> {
    try{
      let posts: ProfilePost[] = []
      if(callsCounter){
        const postsResponseDTO: PostsResponseDTO[] = await this.apiHandlerService.getProfileFeedData(callsCounter, username)
        posts = this.getPosts(postsResponseDTO)
      }else{
        const postsResponseDTO: PostsResponseDTO = await this.apiHandlerService.getProfilePostsData(username)
        const postsResponses = [postsResponseDTO]
        posts = this.getPosts(postsResponses)
      }
      return posts
    }catch(err){
      console.info(err)
      throw err
    }
  }

  private async getTagPostsData(username: string): Promise<ProfilePost[]> {
    try{
      let posts: TagPost[] = []
      const tagPostsResponseDTO: TagResponseDTO = await this.apiHandlerService.getTagPostsData(username)
      const postsResponses = [tagPostsResponseDTO]
      posts = this.getTagPosts(postsResponses)
      return posts
    }catch(err){
      console.info(err)
      throw err
    }
  }

  private async getProfileCommentsData(mediaId: string, shortcode: string): Promise<Comment[]> {
    try{
      const comments: Comment[] = []
      const profileCommentsResponse: IProfileComments = await this.apiHandlerService.getProfileCommentsData(mediaId)
      profileCommentsResponse.data?.forEach((commentResp: IPostComment) => {
        const _comments: Comment[] = commentINTFFromResponse(commentResp, shortcode)
        comments.push(..._comments)
      })
      return comments
    }catch(err){
      console.info(err)
      throw err
    }
  }

  private async getProfileData(user_id: number, username: string): Promise<Profile> {
    try{
      const profileResponseDTO: ProfileResponseDTO = await this.apiHandlerService.getProfileData(user_id, username)
      const profileINTF: ProfileINTF = this.toProfileINTF(profileResponseDTO)
      return new Profile(profileINTF)
    }catch(err){
      console.info(err)
      throw err
    }
  }

  async getDBProfilePosts(params: {profile: ProfileINTF, lastPosts?: boolean, max?: number}): Promise<ICreateProfilePost[]>{
    try{
      const profilePosts = await this.db_profileService.getProfilePosts(params)
      return profilePosts
    }catch(err){throw err}
  }
  

  private getPosts(profilePostsResponseDTOs: PostsResponseDTO[]): ProfilePost[]{
    const allPosts: IApiHdlrProfilePost[] = [];
    const profilePosts: ProfilePost[] = []
    profilePostsResponseDTOs.forEach(profilePostResponse => {
      allPosts.push(...profilePostResponse.items) 
    })
    const uniquePosts = this.getUniquePosts(allPosts)
    uniquePosts?.forEach(post => {
      const postResponseINTF = <PostResponseINTF>(post as unknown)
      const profilePost: ProfilePost = new ProfilePost(postResponseINTF)
      profilePosts.push(profilePost)
    })
    return profilePosts
  }

  private getTagPosts(tagPostsResponseDTOs: TagResponseDTO[]): ProfilePost[]{
    const allPosts: IApiHdlrTagPost[] = []
    const tagPosts: ProfilePost[] = []
    tagPostsResponseDTOs.forEach(tagPostResponse => {
      allPosts.push(...tagPostResponse.data) 
    })
    const uniquePosts = this.getUniqueTagPosts(allPosts)
    uniquePosts?.forEach(post => {
      const tagPostINTF = <ITagResponse>(post as unknown)
      const tagPost: ProfilePost = new ProfilePost(tagPostINTF)
      tagPosts.push(tagPost)
    })
    return tagPosts
  }

  // ------------------------------ Place -----------------------------
  private async findPlace(ig_id: number): Promise<PlaceINTF>{
    return await this.databaseService.findPlaceByIg_id(ig_id)
  }

  private async createPlace(placeDTO: PlaceDTO): Promise<PlaceINTF>{
    return await this.databaseService.createPlace(placeDTO)
  }
  
  // private async savePlace(placeINTF: PlaceINTF): Promise<PlaceINTF>{
  //   if(!hasValues(placeINTF)){
  //     return {} as PlaceINTF
  //   }
  //   const placeDTO = new PlaceDTO(placeINTF)
  //   const place = await this.findPlace(placeDTO.ig_id)
  //   return place ?? await this.createPlace(placeDTO)
  // }

  private async savePlace(placeINTF: PlaceINTF): Promise<PlaceINTF>{
    if(!hasValues(placeINTF)){ return {} as PlaceINTF }
    try{
      const placeDTO = new PlaceDTO(placeINTF)
      const place = await this.databaseService.upsertPlace({place: placeDTO, return_new: true})
      return place
    }catch(err){
      this.appLogger.error(this.savePlace.name, '', err)
      console.error(err.message)
    }
  }  

  // ---------------------------- Comment ----------------------------  
  private async saveComment(createCommentINTF: CreateCommentINTF): Promise<CreateCommentINTF>{
    try{
      const createCommentDTO = new CreateCommentDTO(createCommentINTF)
      const comment = await this.db_profileService.upsertComment({comment: createCommentDTO, return_new: false})
      return comment
    }catch(err){ throw err }
  }

  // ---------------------------- Posts ----------------------------
  private async findProfilePost(shortcode: string): Promise<ICreateProfilePost>{
    return this.db_profileService.findProfilePostByShortcode(shortcode)
  }

  private async saveProfilePost(createProfilePostINTF: ICreateProfilePost): Promise<ICreateProfilePost>{
    try{
      const createProfilePostDTO = new CreateProfilePostDTO(createProfilePostINTF)
      const profilePost = await this.db_profileService.upsertProfilePost({profilePost: createProfilePostDTO, return_new: true})
      return profilePost
    }catch(err){ throw err }
  }  
  
  private async saveTagPost(createTagPostINTF: ICreateTagPost): Promise<ICreateTagPost>{
    try{
      const createTagPostDTO = new CreateTagPostDTO(createTagPostINTF)
      const profilePost = await this.db_profileService.upsertTagPost({tagPost: createTagPostDTO, return_new: true})
      return profilePost
    }catch(err){ throw err }
  }

  private async getSentimentUnanalyzedPosts(analyzeProfileSentimentDTO: AnalyzeProfileSentimentDTO): Promise<ICreateProfilePost[]>{
    const {_profile_id, last_minutes, max_to_process} = analyzeProfileSentimentDTO
    try{
      const since_timestamp = new Date().getTime() - (last_minutes * 60000)
      const unanalyzedPosts = await this.db_profileService.getUnanalyzedProfilePosts({profile_id: _profile_id, since_date: new Date(since_timestamp), limit: max_to_process})
      return unanalyzedPosts
    }catch(e){ throw e }
  }

  private async getSentimentUnanalyzedTags(analyzeProfileSentimentDTO: AnalyzeProfileSentimentDTO): Promise<ICreateTagPost[]>{
    const {_profile_id, last_minutes, max_to_process} = analyzeProfileSentimentDTO
    try{
      let since_timestamp
      if(last_minutes){
        const _since_timestamp = new Date().getTime() - (last_minutes * 60000)
        since_timestamp = new Date(_since_timestamp)
      }
      const unanalyzedPosts = await this.db_profileService.getUnanalyzedTagPosts({profile_id: _profile_id, since_date: since_timestamp, limit: max_to_process})
      return unanalyzedPosts
    }catch(e){ throw e }
  }

  private async getSentimentUnanalyzedComments(analyzeProfileSentimentDTO: AnalyzeProfileSentimentDTO): Promise<CreateCommentINTF[]>{
    const {_profile_id, last_minutes, max_to_process} = analyzeProfileSentimentDTO
    try{
      const since_timestamp = new Date().getTime() - (last_minutes * 60000)
      console.info(new Date(since_timestamp))
      const unanalyzedPosts = await this.db_profileService.getUnanalyzedComments({profile_id: _profile_id, since_date: new Date(since_timestamp), limit: max_to_process})
      return unanalyzedPosts
    }catch(e){
      throw e
    }
  }

  // async updateProfilePostText(profilePost: ProfilePostINTF): Promise<void>{
  //   try{
  //     await this.db_profileService.updateProfilePostText(profilePost)
  //   }catch(e){
  //     throw e
  //   }
  // }

  // async updateCommentText(comment: CommentINTF): Promise<void>{
  //   try{
  //     await this.db_profileService.updateCommentText(comment)
  //   }catch(e){
  //     throw e
  //   }
  // }

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------
  // --------------------------------  PRIVATE FUNCTIONS ---------------------------------
  private getUniquePosts(posts: IApiHdlrProfilePost[]): IApiHdlrProfilePost[]{
    console.log('total duplicated posts: ' + posts.length)
    const uniqueMap = new Map<string, IApiHdlrProfilePost>()
    posts.forEach(post => uniqueMap.set(post.code, post))
    const uniquePosts = Array.from(uniqueMap).map(map => {return map[1]})
    console.log('total unique posts: ' + uniquePosts.length)
    return uniquePosts
  }

  private getUniqueTagPosts(posts: IApiHdlrTagPost[]): IApiHdlrTagPost[]{
    console.log('total duplicated posts: ' + posts.length)
    const uniqueMap = new Map<string, IApiHdlrTagPost>()
    posts.forEach(post => uniqueMap.set(post.code, post))
    const uniquePosts = Array.from(uniqueMap).map(map => {return map[1]})
    console.log('total unique posts: ' + uniquePosts.length)
    return uniquePosts
  }

  private toProfileINTF(profileResponseDTO: ProfileResponseDTO): ProfileINTF{
    const profileINTF: ProfileINTF = {
      ig_id: profileResponseDTO.pk,   //PK
      username: profileResponseDTO.username,
      full_name: profileResponseDTO.full_name,
      biography: profileResponseDTO.biography,
      profile_pic: {
        source_url: profileResponseDTO.profile_pic_url
      },
      is_verified: profileResponseDTO.is_verified,

      //---- stats -----
      media_count: profileResponseDTO.media_count,
      following_count: profileResponseDTO.following_count,
      follower_count: profileResponseDTO.follower_count,
      total_igtv_videos: profileResponseDTO.total_igtv_videos,
      total_clips_count: profileResponseDTO.total_clips_count,
      total_ar_effects: profileResponseDTO.total_ar_effects,
      usertags_count: profileResponseDTO.usertags_count,
      mutual_followers_count: profileResponseDTO.mutual_followers_count,
      //----------------
      
      has_videos: profileResponseDTO.has_videos,
      external_url: profileResponseDTO.external_url,
      category: profileResponseDTO.category,
      account_type: profileResponseDTO.account_type,
      is_private: profileResponseDTO.is_private,
      is_business: profileResponseDTO.is_business,
      is_favorite: profileResponseDTO.is_favorite,
      is_interest_account: profileResponseDTO.is_interest_account,
      has_biography_translation: profileResponseDTO.has_biography_translation,
      direct_messaging: profileResponseDTO.direct_messaging,
      has_highlight_reels: profileResponseDTO.has_highlight_reels,
      has_chaining: profileResponseDTO.has_chaining,
      has_guides: profileResponseDTO.has_guides,
    
      city_name: profileResponseDTO.city_name,
      zip: profileResponseDTO.zip,
      city_id: profileResponseDTO.city_id,
      address_street: profileResponseDTO.address_street,
      longitude: profileResponseDTO.longitude,
      latitude: profileResponseDTO.latitude,
      
      public_email: profileResponseDTO.public_email,
      whatsapp_number: profileResponseDTO.whatsapp_number,
      contact_phone_number: profileResponseDTO.contact_phone_number,
      public_phone_country_code: profileResponseDTO.public_phone_country_code,
      public_phone_number: profileResponseDTO.public_phone_number,
      business_contact_method: profileResponseDTO.business_contact_method,
      smb_delivery_partner: profileResponseDTO.smb_delivery_partner,
      smb_support_delivery_partner: profileResponseDTO.smb_support_delivery_partner,
      is_eligible_for_smb_support_flow: profileResponseDTO.is_eligible_for_smb_support_flow,
      is_potential_business: profileResponseDTO.is_potential_business,
      is_memorialized: profileResponseDTO.is_memorialized,
      
      can_be_reported_as_fraud: profileResponseDTO.can_be_reported_as_fraud
    }
    return profileINTF
  }
}
