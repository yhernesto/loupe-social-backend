import { IsBoolean, IsInt, IsNotEmpty, IsObject, IsPositive, Min, validateOrReject } from "class-validator";
import { HashtagPostINTF, dimensions, media_type } from '../hashtagPost.intf'
import { TextSentimentINTF } from "src/third-party-apis/Google/Sentiment/interfaces/TextSentiment.intf";
import { IImage } from "../../Profile/Image.intf";

export class CreateHashtagPostDTO implements HashtagPostINTF{
  @IsNotEmpty()
  ig_id: number;

  @IsNotEmpty()
  @IsBoolean()
  is_top: boolean;

  @IsObject()
  image: IImage;

  shortcode: string;

  @IsInt()
  @Min(0)
  likes: number;

  @IsInt()
  @Min(0)
  comments: number;

  @IsObject()
  text: TextSentimentINTF;

  @IsPositive()  
  taken_at_timestamp:number;

  dimensions: dimensions;

  @IsPositive()  
  account_id: number;

  @IsNotEmpty()
  media_type: media_type;

  @IsNotEmpty()
  hashtag: string;

  username?: string
  carousel_media_count?: number
  can_see_insights_as_brand?: boolean
  place_ig_id?: number
  is_paid_partnership?: boolean
  accessibility_caption?: string

  updatedAt?: Date;
  createdAt?: Date;

  constructor(hashtagPostINTF: Partial<HashtagPostINTF> = {}) {
    Object.assign(this, hashtagPostINTF);
    this.validateMembers()
  }

  validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }

}
