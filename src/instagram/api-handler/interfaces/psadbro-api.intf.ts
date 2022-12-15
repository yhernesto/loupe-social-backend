import { RapidApiParams } from "./rapid-api.interface";

export interface PsadbroApiParams extends RapidApiParams{
  params: PsadbroHashtagPostsQueryParams | PsadbroProfileQueryParams | PsadbroProfilePostsQueryParams
}

export interface PsadbroHashtagPostsQueryParams {
  hashtag: string
  endcursor?: string
}

export interface PsadbroProfileQueryParams {
  userid: number
}

export interface PsadbroProfilePostsQueryParams{
  username: string
}