import { Schema } from "mongoose";
import { Location } from "src/instagram/api-handler/interfaces/dtos/Kirtan/KirtanHashtagResponse.dto";
import { IImage } from "src/shared/modules/database/interfaces/Profile/Image.intf";
import { TextSentimentINTF } from "./HashtagSentimentText.intf";

export interface dimensions {
  width: number,
  height: number,
}

export enum media_type {
  image = 0, 
  video = 1,
}
export interface HashtagPostModelINTF {
  ig_id: number;
  is_top: boolean;
  image_src: string;
  shortcode: string;
  likes: number;
  comments: number;
  text: string;
  taken_at_timestamp:number;
  dimensions: dimensions;
  account_id: number;
  media_type: media_type;
  hashtag: string;
  username?: string,
  carousel_media_count?: number
  can_see_insights_as_brand?: boolean
  location?: Location
  is_paid_partnership?: boolean
  accessibility_caption?: string
  updatedAt?: Date;
  createdAt?: Date;
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
  account_id: number;
  media_type: media_type;
  hashtag: string;
  username?: string
  carousel_media_count?: number
  can_see_insights_as_brand?: boolean
  place_ig_id?: number
  // location?: Location
  is_paid_partnership?: boolean
  accessibility_caption?: string
  updatedAt?: Date;
  createdAt?: Date;
}