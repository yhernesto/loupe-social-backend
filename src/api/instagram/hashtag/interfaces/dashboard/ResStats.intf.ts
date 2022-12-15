export interface IResStats {
  time: string,
  likes: number
  posts: number
  comments: number
  unique_profiles: number
}

export class ResStatsDTO implements IResStats {
  time: string = null
  likes: number = null
  posts: number = null
  comments: number = null
  unique_profiles: number = null

  public constructor(init?:Partial<IResStats>) {
    Object.assign(this, init);
  }
}