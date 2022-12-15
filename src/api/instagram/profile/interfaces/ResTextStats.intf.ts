export interface TextAvgStats {
  avgLikes: number,
  avgComments: number,
  times: number
}

export interface ResTextAvgStats {
  range: string,
  stats: TextAvgStats
}

export interface ResTextStatsINTF{
  numberOfHashtagStats: ResTextAvgStats[],
  postsLengthStats: ResTextAvgStats[]
}