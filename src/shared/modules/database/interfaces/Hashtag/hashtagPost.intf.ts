import { TextSentimentINTF } from "src/third-party-apis/Google/Sentiment/interfaces/TextSentiment.intf";
import { IImage } from "../Profile/Image.intf";

export interface dimensions {
  width: number,
  height: number,
}

export enum media_type {
  image = 0, 
  video = 1,
}
export interface HashtagPostINTF {
  _id?: string,
  ig_id: number;
  is_top: boolean;
  image: IImage;
  shortcode: string;
  likes: number;
  comments: number;
  text: TextSentimentINTF;
  taken_at_timestamp:number;
  dimensions: dimensions;
  account_id: number,
  username?: string,
  media_type: media_type,
  hashtag: string,
  carousel_media_count?: number,
  can_see_insights_as_brand?: boolean,
  place_ig_id?: number
  is_paid_partnership?: boolean,
  accessibility_caption?: string,
  updatedAt?: Date,
  createdAt?: Date
}