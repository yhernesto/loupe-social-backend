
import { HashtagPostINTF as CreateHashtagPostINTF, dimensions, media_type } from '../../../shared/modules/database/interfaces/Hashtag/hashtagPost.intf'
import { CreateHashtagPostDTO } from '../../../shared/modules/database/interfaces/Hashtag/dtos/CreateHashtagPost.dto'
import { TextSentimentINTF } from 'src/third-party-apis/Google/Sentiment/interfaces/TextSentiment.intf'
import { HashtagPostModelINTF } from '../interfaces/HashtagPost.intf'
import { IImage } from 'src/instagram/shared/interfaces/dtos/Image.intf'
import { strDay, strHour, strMinutes, strMonth, strSeconds, strYear } from 'src/shared/utils/Utils'
import { Location } from 'src/instagram/api-handler/interfaces/dtos/Kirtan/KirtanHashtagResponse.dto'


export class HashtagPost{
  ig_id: number
  is_top: boolean
  image_src: string
  shortcode: string
  likes: number
  comments: number
  text: string
  taken_at_timestamp:number
  dimensions: dimensions
  account_id: number
  media_type: media_type
  hashtag: string
  username?: string
  carousel_media_count?: number
  can_see_insights_as_brand?: boolean
  location?: Location
  is_paid_partnership?: boolean
  accessibility_caption?: string

  constructor(hashtagPostINTF: Partial<HashtagPostModelINTF> = {}) {
    Object.assign(this, hashtagPostINTF)
  }

   public toCreateHashtagPostDTO(): CreateHashtagPostDTO{
     try{
       const emptyTextSentiment: TextSentimentINTF = { text: this.text }
       const image: IImage = { source_url: this.image_src }
   
       const createHashtagPostINTF: CreateHashtagPostINTF = {
         ig_id: this.ig_id,
         is_top: this.is_top,
         image: image,
         shortcode: this.shortcode,
         likes: this.likes,
         comments: this.comments,
         text: emptyTextSentiment,
         taken_at_timestamp: this.taken_at_timestamp,
         dimensions: this.dimensions,
         account_id: this.account_id,
         media_type: this.media_type,
         hashtag: this.hashtag,
         username: this.username || undefined,
         carousel_media_count: this.carousel_media_count || undefined, 
         can_see_insights_as_brand: this.can_see_insights_as_brand || undefined,
         place_ig_id: this.location?.pk,
         is_paid_partnership: this.is_paid_partnership || undefined,
         accessibility_caption: this.accessibility_caption || undefined
       }
   
       const hashtagPostDTO = new CreateHashtagPostDTO(createHashtagPostINTF)
       return hashtagPostDTO
     }catch(err){ throw err}
  }

  private getPostPicName(): string {
    if(this.image_src){
      try{
        const now = new Date()
        return this.shortcode + '-' + strYear(now, true) + strMonth(now) + strDay(now) + '_' + strHour(now) + strMinutes(now) + strSeconds(now)
      }catch(e){
        throw e
      }
    }
  }
}