export interface TrendingTopics {
  name: string,
  url: string,
}

export interface News {
  title: string
  image_url: string
  source: {
    date: string
    name: string
    url: string
  }
}

export interface ResNewsINTF {
  news: News[],
  trending_topics?: TrendingTopics[]
}