export enum AnalyzeMode {
  'CAPTION' = 0,
  'COMMENTS' = 1,
  'TAGS' = 2,
  'CAPTION_COMMENTS_TAGS' = 3
}

interface AnalyzeSentimentINTF {
  max_to_process: number,
  last_minutes?: number
}

export interface AnalyzeHashtagSentimentINTF extends AnalyzeSentimentINTF {
  hashtag?: string
}

export interface AnalyzeProfileSentimentINTF extends AnalyzeSentimentINTF {
  _profile_id?: string
  analyze_mode: AnalyzeMode
}