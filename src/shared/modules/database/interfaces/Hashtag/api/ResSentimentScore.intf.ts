export interface ResSentimentScoreINTF {
  score: number
  magnitude: number
  posts: number
  positives: {
    posts: number
    score: number
    magnitude: number
  },
  negatives: {
    posts: number
    score: number
    magnitude: number
  }
}

export const resSentimentScoreEmpty = {
  score: null,
  magnitude: null,
  posts: 0,
  positives: {
    posts: 0,
    score: null,
    magnitude: null
  },
  negatives: {
    posts: 0,
    score: null,
    magnitude: null
  }
}