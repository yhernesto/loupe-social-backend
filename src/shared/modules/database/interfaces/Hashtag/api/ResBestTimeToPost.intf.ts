interface BasicStats {
  min: number,
  max: number
}

export interface HourStat {
  hour: number
  likes: number
  diffLikes?: number
  comments: number
  diffComments?: number
}

export interface Day{
  day_number: number
  hoursStats: HourStat[]
}


export interface ResBestTimeToPostINTF {
  days: Day[],
  likes_stats: BasicStats,
  comments_stats: BasicStats
}

export const resBestTimeToPostEmpty = {
  days: [],
  likes_stats: {
    min: null,
    max: null
  },
  comments_stats: {
    min: null,
    max: null
  }
}