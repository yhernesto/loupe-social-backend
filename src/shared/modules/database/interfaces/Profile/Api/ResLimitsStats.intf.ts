interface Limits {
  min: number,
  max: number
}

export interface ResLimitsStatsINTF {
  likes: Limits,
  comments: Limits
}

export interface ResLimitsSentiment {
  score: Limits,
  magnitude: Limits
}