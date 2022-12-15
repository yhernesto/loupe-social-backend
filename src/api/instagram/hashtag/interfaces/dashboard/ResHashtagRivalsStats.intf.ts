export interface ResHashtagRivalsStatsINTF {
  hashtag: string
  current_posts: number
  current_score: number         //avg sentiment score in current period
  current_score_pct: number
  current_magnitude: number     //avg sentiment magnitude in current period
  prev_posts: number            
  prev_score_pct: number
  prev_score: number            //avg sentiment score in previous period
  prev_magnitude: number        //avg sentiment magnitude in previous period
  posts_logs: number[]          //posts count in current period
}