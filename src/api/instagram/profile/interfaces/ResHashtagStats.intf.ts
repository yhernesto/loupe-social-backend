export interface TextStats {
  text: string
  likes: number
  comments: number
  //views: number
}

export interface ResHashtagStatsINTF {
  hashtag: string
  avgLikes: number
  avgComments: number
  //views: number
}

// interface AvgStat {
//   value: number
//   times: number
// }

export interface MappedHashtagStats {
  times: number
  avgLikes: number
  avgComments: number
}