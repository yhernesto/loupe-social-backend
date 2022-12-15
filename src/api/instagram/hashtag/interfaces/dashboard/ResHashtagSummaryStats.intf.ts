import { IResStats } from "./ResStats.intf";

export interface IResSummaryStats {
  likes: number,
  comments: number,
  posts: number,
  unique_profiles: number,
  stats_logs: IResStats[]
}

export class ResHashtagSummaryStatsDTO implements IResSummaryStats{
  likes: number = null
  comments: number = null
  posts: number = null
  unique_profiles: number = null
  stats_logs: IResStats[] = []

  public constructor(init?:Partial<IResSummaryStats>) {
    Object.assign(this, init);
  }
}