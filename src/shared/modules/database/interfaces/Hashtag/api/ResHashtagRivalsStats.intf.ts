export interface ResHashtagRivalsStatsINTF {
  hashtag: string
  current_posts: number
  prev_posts: number
  current_score: number
  current_score_pct: number
  current_magnitude: number
  prev_score: number
  prev_score_pct: number
  prev_magnitude: number
}

export const resHashtagRivalsStatsEmpty = {
  hashtag: '',
  current_posts: null,
  prev_posts: null,
  current_score: null,
  current_score_pct: null,
  current_magnitude: null,
  prev_score: null,
  prev_score_pct: null,
  prev_magnitude: null
}