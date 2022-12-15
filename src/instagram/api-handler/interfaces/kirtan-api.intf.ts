import { RapidApiParams } from "./rapid-api.interface";

export interface PsadbroApiParams extends RapidApiParams{
  params: KirtanHashtagPostsQueryParams | KirtanProfileQueryParams | KirtanProfilePostsQueryParams
}

export interface KirtanHashtagPostsQueryParams {
  tag: string
  feed_type: string
  nextMaxId?: string
}

export interface KirtanProfileQueryParams {
  userid: number
}

export interface KirtanProfilePostsQueryParams{
  username: string
}