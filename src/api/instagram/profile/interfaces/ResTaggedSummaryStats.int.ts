import { IResTaggedStats } from "./ResTaggedStats.int"

export interface IResSummaryStats {
    likes: number,
    comments: number,
    posts: number,
    unique_profiles: number,
    stats_logs: IResTaggedStats[]
}
  
export class ResTaggedSummaryStatsDTO implements IResSummaryStats{
    likes: number = null
    comments: number = null
    posts: number = null
    unique_profiles: number = null
    stats_logs: IResTaggedStats[] = []
  
    public constructor(init?:Partial<IResSummaryStats>) {
      Object.assign(this, init);
    }
}