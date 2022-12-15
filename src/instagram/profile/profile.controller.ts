import { Controller, Get} from '@nestjs/common'
import { ProfileService } from './profile.service'
import { SentimentService } from 'src/third-party-apis/Google/Sentiment/Sentiment.service'


@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService, private sentimentService: SentimentService){}

  @Get('/loadProfile')
  async profile(): Promise<void>{
    try{
      const userId = 3959631415
      const username = 'ishopperu'
      // await this.profileService.loadProfile(userId, username)
    }catch(err){ throw err }
  }

  // @Get('/posts')
  // async posts(){
  //   const username = 'nike.pe'
  //   const profilePosts: ProfilePost[] = await this.profileService.getPostsData(username);
  //   if(profilePosts){
  //     await Promise.all(profilePosts.map(async (post) => {
  //       const profile: CreateProfileINTF = await this.profileService.saveProfile(post.profile)
  //       const place: CreatePlaceINTF = await this.profileService.savePlace(post.place)
  //       post.usertags?.forEach( async tag => {
  //         const taggedUser: CreateProfileINTF = await this.profileService.saveProfile(tag.user_tagged) 
  //         const createTagINTF: CreateTagINTF = {
  //           post_shortcode: tag.tag.post_shortcode,
  //           owner_id: profile._id,
  //           tagged_id: taggedUser._id,
  //           position: tag.tag.position,
  //           video: tag.tag.video
  //         } 
  //         await this.profileService.saveTag(createTagINTF)        
  //       })
  
  //       //save profile post
  //       const oldPostImage = await this.getOldPostImage(post.shortcode)
  //       const createProfilePostINTF = await post.getCreateProfilePostINTF({profile_id: profile._id, place_id: place._id, old_post_img: oldPostImage})
  //       const upsertedProfilePost = await this.profileService.saveProfilePost(createProfilePostINTF)
  //       await this.createProfilePostStatLog(upsertedProfilePost)
  
  //       //create comments
  //       post.comments?.forEach(async comment => {
  //         //comment and createComment are different, Comment comes from RapidApi and CreateComment goes to DB
  //         const createCommentINTF: CreateCommentINTF = {
  //           ig_id: comment.ig_id,
  //           post_shortcode: comment.post_shortcode,
  //           post_owner_id: profile._id,
  //           user_id: comment.user_id,
  //           likes: comment.likes,
  //           media_id: comment.media_id,
  //           share_enabled: comment.share_enabled,
  //           text: {
  //             text: comment.text
  //           }, 
  //           private_reply_status: comment.private_reply_status,
  //           taken_at: comment.taken_at,
  //           reported_as_spam: comment.reported_as_spam,
  //           content_type: comment.content_type
  //         }
  //         await this.profileService.saveComment(createCommentINTF)
  //       })
  //     }))
  //   }else{
  //     throw new HttpException({
  //       status: HttpStatus.BAD_GATEWAY,
  //       error: 'Instagram API is not returning appropriate data',
  //     }, HttpStatus.BAD_GATEWAY);
  //   }
  // }

  // @Post('/analyze_sentiment')
  // async analyze_sentiment(
  //   @Body (new ValidationPipe()) analyzeProfileSentimentDTO: AnalyzeProfileSentimentDTO) : Promise<string>{
  //     let apiResponseInformation
  //     if(analyzeProfileSentimentDTO.analyze_mode === AnalyzeMode.CAPTION || analyzeProfileSentimentDTO.analyze_mode === AnalyzeMode.CAPTION_AND_COMMENTS){
  //       apiResponseInformation = await this.analyzeProfilePostSentiment(analyzeProfileSentimentDTO)
  //     }
  //     if(analyzeProfileSentimentDTO.analyze_mode === AnalyzeMode.COMMENTS || analyzeProfileSentimentDTO.analyze_mode === AnalyzeMode.CAPTION_AND_COMMENTS){
  //       apiResponseInformation = await this.analyzeCommentSentiment(analyzeProfileSentimentDTO)
  //     }
  //     return apiResponseInformation
  // }

  // @Post('/test_store')
  // async test_store() : Promise<void>{
  //   try{
  //     // await this.profileService.uploadImagetest({source_url: 'https://cctc.mx/wp-content/themes/cera/assets/images/avatars/user-avatar.png', name: 'test2.jpg'})
  //     const config = {
  //       uri: 'https://instagram.flim13-1.fna.fbcdn.net/v/t51.2885-19/s320x320/205353522_330312398628883_4958314772949664033_n.jpg?_nc_ht=instagram.flim13-1.fna.fbcdn.net&_nc_ohc=RjDXBsHPm7MAX_HziHo&tn=Msy__mjMSQW-y8Pg&edm=ABfd0MgBAAAA&ccb=7-4&oh=44c132cdcdb581dbb21b63ea75945ca7&oe=616953D0&_nc_sid=7bff83',   //0f26a664fe00383c
  //       uri2: 'https://instagram.fcuz1-1.fna.fbcdn.net/v/t51.2885-15/e35/s1080x1080/245678893_599202301259088_874173482683654689_n.jpg?_nc_ht=instagram.fcuz1-1.fna.fbcdn.net&_nc_cat=100&_nc_ohc=gkdMjTnphP0AX91Cglh&tn=mojnIAsiutwcSrA6&edm=AP_V10EBAAAA&ccb=7-4&oh=5ba89ec05fc6c7d12f59e5fc8844bb63&oe=6170FC06&_nc_sid=4f375e', 
  //       uri3: 'https://cctc.mx/wp-content/themes/cera/assets/images/avatars/user-avatar.png'   //0f26a664fe00383c
  //     };
      
  //     const hash1 = await hashImageByUrl(config.uri)
  //     const hash2 = await hashImageByUrl(config.uri2)
  //     if(hash1 === hash2){
  //       console.info('are equals')
  //     }else{
  //       console.info('is not')
  //     }

  //   }catch(e){
  //     throw e
  //   }  
  // }
  

  // // -----------------------------------------------------------------------------------------//
  // // ------------------------------------ PRIVATE METHODS ------------------------------------//

  // async createProfilePostStatLog(profilePostINTF: CreateProfilePostINTF): Promise<void>{
  //   const diffSeconds = diffDates({date_1: profilePostINTF.updatedAt, date_2: profilePostINTF.createdAt, options: TimeOptions.SECONDS})
  //     if(diffSeconds <= 3600){  // 1 hour
  //       const createProfilePostStatLog: ProfilePostStatsLogINTF = {
  //         _profile_id: profilePostINTF._profile_id,
  //         post_shortcode: profilePostINTF.shortcode,
  //         comments_count: profilePostINTF.comments_count,
  //         likes_count: profilePostINTF.likes_count        
  //       }
  //       await this.profileService.createProfilePostStatLog(createProfilePostStatLog)
  //     }
  // }

  // async analyzeCommentSentiment(analyzeProfileSentiment: AnalyzeProfileSentimentINTF): Promise<string>{
  //   let processedTexts = 0
  //   const unanalyzedComments = await this.profileService.getSentimentUnanalyzedComments(analyzeProfileSentiment)
  //   unanalyzedComments.forEach(p=>{console.info(p)})
  //   await Promise.all(unanalyzedComments.map(async (comment) => {
  //     if(comment.text.text !== ""){
  //       processedTexts++
  //       const textSentiment = await this.sentimentService.analyseTextSentiment(comment.text.text)
  //       if(textSentiment){
  //         comment.text = textSentiment
  //       }
  //       await this.profileService.updateCommentText(comment)
  //     }
  //   }))
  //   const res = 'Total texts: ' + unanalyzedComments.length + '. Analyzed: ' + processedTexts
  //   return res
  // }


  // async analyzeProfilePostSentiment(analyzeProfileSentiment: AnalyzeProfileSentimentINTF): Promise<string>{
  //   let processedTexts = 0
  //   const unanalyzedPosts = await this.profileService.getSentimentUnanalyzedPosts(analyzeProfileSentiment)
  //   unanalyzedPosts.forEach(p=>{console.info(p)})
  //   await Promise.all(unanalyzedPosts.map(async (post) => {
  //     if(post.text.text !== ""){
  //       processedTexts++
  //       const textSentiment = await this.sentimentService.analyseTextSentiment(post.text.text)
  //       if(textSentiment){
  //         post.text = textSentiment
  //       }
  //       await this.profileService.updateProfilePostText(post)
  //     }
  //   }))
  //   const res = 'Total texts: ' + unanalyzedPosts.length + '. Analyzed: ' + processedTexts
  //   return res
  // }


  // private newPictureMustBeTaken(savedProfile: ProfileINTF, newProfile: ProfileINTF): boolean {
  //   if(!savedProfile.profile_pic?.hash){
  //     return true
  //   }
  //   if(newProfile.profile_pic?.hash){
  //     if(savedProfile.profile_pic.hash === newProfile.profile_pic.hash){
  //       return false
  //     }
  //     return true
  //   }
  //   return false
  // }

  // private async getOldPostImage(shortcode: string): Promise<any>{
  //   const savedPost = await this.profileService.findProfilePost(shortcode)
  //   if(savedPost?.image?.source_url){
  //     return savedPost.image
  //   }
  //   return null
  // }
}
