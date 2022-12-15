import { IResHashtagStats } from "./ResTaggedStats.int"

export interface IResSummaryStats {
    likes: number,
    comments: number,
    posts: number,
    unique_profiles: number,
    stats_logs: IResHashtagStats[]
}
  
export const resSummaryStatsEmpty = {
    likes: 0,
    comments: 0,
    posts: 0,
    unique_profiles: 0,
    stats_logs: []
}