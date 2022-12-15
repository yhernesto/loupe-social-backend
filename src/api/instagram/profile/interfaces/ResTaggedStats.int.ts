export interface IResTaggedStats {
    time: string
    likes: number
    posts: number
    unique_profiles: number
    comments: number
}
  
export class ResStatsDTO implements IResTaggedStats {
    time: string = null
    likes: number = null
    posts: number = null
    unique_profiles: number = null
    comments: number = null
  
    public constructor(init?:Partial<IResTaggedStats>) {
      Object.assign(this, init);
    }
}