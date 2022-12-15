import { Schema as MongooseSchema } from 'mongoose';
import { IPostsByProfile } from './ResPostsByProfile.intf';

export interface IResTopInfluencerLite {
  _profile_id: string,
  ig_id: number,   //PK
  username: string,
  full_name: string,
  profile_pic_url: string,
  is_verified?: boolean,
  posts: number,
  followers: number,
  hashtagMentions: number
}

export interface IResTopInfluencersNew extends IResTopInfluencerLite{
  biography: string,
  likesByHashtag: number,
  commentsByHashtag: number,
  hashtagMentions: number
  scoreByHashtag: number
  score_pct: number
  LastHashtagPost?: IPostsByProfile
}

export interface TopInfluencerSummaryProfile {
  _profile_id?: MongooseSchema.Types.ObjectId,
  ig_id: number,   //PK
  username: string,
  full_name: string, 
  biography: string,
  profile_pic_url: string,
  is_verified?: boolean,
  posts: number,
  followers: number,
  likesByHashtag: number,
  commentsByHashtag: number,
  hashtagMentions: number
}

export interface ResTopInfluencersINTF {
  byHashtag: TopInfluencerSummaryProfile[],
  byLikes: TopInfluencerSummaryProfile[],
  byComments: TopInfluencerSummaryProfile[]
}