import { Schema as MongooseSchema } from 'mongoose';
import { IPostsByProfile } from './ResHashtagPost.intf';

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

export class ResTopInfluencerLiteDTO implements IResTopInfluencerLite{
  _profile_id: string = null
  ig_id: number = null   //PK
  username: string = null
  full_name: string = null
  profile_pic_url: string = null
  is_verified?: boolean = null
  posts: number = null
  followers: number = null
  hashtagMentions: number = null

  public constructor(init?:Partial<IResTopInfluencerLite>) {
    Object.assign(this, init);
  }
}

/************************************************ */

export interface IResTopInfluencersNew extends IResTopInfluencerLite {
  biography: string,
  likesByHashtag: number,
  commentsByHashtag: number,
  hashtagMentions: number,
  scoreByHashtag: number,
  score_pct: number,
  LastHashtagPost?: IPostsByProfile
}


/************************************************ */

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

export interface IResTopInfluencers {
  byHashtag: TopInfluencerSummaryProfile[],
  byLikes: TopInfluencerSummaryProfile[],
  byComments: TopInfluencerSummaryProfile[]
}

export class ResTopInfluencersDTO implements IResTopInfluencers {
  byHashtag: TopInfluencerSummaryProfile[] = []
  byLikes: TopInfluencerSummaryProfile[] = []
  byComments: TopInfluencerSummaryProfile[] = []

  public constructor(init?:Partial<IResTopInfluencers>) {
    Object.assign(this, init);
  }
}