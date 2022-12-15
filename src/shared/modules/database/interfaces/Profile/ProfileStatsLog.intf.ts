import { IImage } from "src/instagram/shared/interfaces/dtos/Image.intf";

//https://www.instagram.com/bembosoficial/?__a=1
export interface ProfileStatsLogINTF {
  user_ig_id: number,
  media_count: number,
  following_count: number,
  follower_count: number,
  total_igtv_videos: number,
  total_clips_count: number,
  total_ar_effects: number,
  usertags_count: number,
  mutual_followers_count: number,
  profile_pic?: IImage
  createdAt?: Date
}