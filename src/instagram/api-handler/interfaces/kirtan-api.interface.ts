import { RapidApiParams } from "./rapid-api.interface";

export interface KirtanApiParams extends RapidApiParams{
  params: KirtanHashtagPostsQueryParams | KirtanProfileQueryParams | KirtanProfilePostsQueryParams | 
  KirtanFeedQueryParams| KirtanProfileCommentsQueryParams | KirtanTagPostsQueryParams
}

export interface KirtanHashtagPostsQueryParams {
  tag: string
  feed_type: string
  corsEnabled: boolean
  nextMaxId?: string
}

export interface KirtanProfileQueryParams {
  ig: number | string
  response_type: string   //default = 'full'
  corsEnabled?: string // default = 'true'
}

export interface KirtanTagPostsQueryParams {
  ig: number | string
  corsEnabled?: string // default = 'true'
}

export interface KirtanProfileCommentsQueryParams {
  media_id: string
  corsEnabled: string // default = 'true'
}

export interface KirtanFeedQueryParams {
  ig: string
  nextMaxId?: string
  corsEnabled: boolean // default = 'true'
}

export interface KirtanProfilePostsQueryParams{
  username: string
}