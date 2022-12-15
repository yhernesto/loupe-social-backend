export interface SectionINTF {
  name: string
  gf_icon: string
  order: number
  url?: string
}

export interface ResWebFeedTopicsINTF {
  country: string
  lang: string
  topic: string
  gf_icon: string
  order: number
  sections?: SectionINTF[]
  url: string
}