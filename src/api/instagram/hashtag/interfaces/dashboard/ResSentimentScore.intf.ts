import { IResReducedPost } from "src/shared/modules/database/interfaces/Hashtag/api/ResReducedPost.int"


export interface IResSentimentScore {
  allPosts: IResPostsSentimentScore
  topPosts: IResPostsSentimentScore
  taggedPosts: IResPostsSentimentScore
}

export interface IResPostsSentimentScore {
  score: number
  magnitude: number
  posts: number
  positives: {
    posts: number
    score: number
    magnitude: number
    postList?: IResReducedPost[]
  },
  negatives: {
    posts: number
    score: number
    magnitude: number
    postList?: IResReducedPost[]
  },
  neutrals?: {
    postList?: IResReducedPost[]
  }
}

export interface IResLimitsSentiments {
  score: {
    min: number
    max: number
  },
  magnitude: {
    min: number
    max: number
  }
}