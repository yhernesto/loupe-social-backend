import { IImage } from 'src/instagram/shared/interfaces/dtos/Image.intf';
import { IProfileStats } from './ResProfileStats.intf'

export interface ILight_profile{
  username: string,
  full_name: string,
  biography: string,
  profile_pic: IImage,
  is_verified: boolean,
}

export interface IResProfileSummaryStats {
  profile: ILight_profile
  current_stats: IProfileStats
  prev_period_stats: IProfileStats
  post_period_stats: IProfileStats
}