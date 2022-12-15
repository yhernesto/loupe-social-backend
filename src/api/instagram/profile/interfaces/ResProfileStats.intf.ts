export interface IProfileStats {
  //likes: number
  //comments: number
  media: number
  followers: number
  following: number
  igtvs: number
  tags: number
  arEffects: number
  stories?: number
}

export interface IResProfileAvgStats extends IProfileStats {
  profile_ig_id: number
} 
