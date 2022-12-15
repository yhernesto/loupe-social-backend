export interface section {
  name: string
  order: number
  gf_icon: string
  url?: string
}

export interface WebFeeds_topicsINTF {
  country: string
  lang: string
  topic: string
  gf_icon: string
  order: number
  sections?: section[]
  url: string
}