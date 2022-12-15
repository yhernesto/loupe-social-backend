import { ResHashtagStatsINTF } from "./ResHashtagStats.intf";

export interface ResSummaryStatsINTF {
  likes: number,
  comments: number,
  posts: number,
  unique_profiles: number,
  stats_logs: ResHashtagStatsINTF[]
}

export const resSummaryStatsEmpty = {
  likes: 0,
  comments: 0,
  posts: 0,
  unique_profiles: 0,
  stats_logs: []
}