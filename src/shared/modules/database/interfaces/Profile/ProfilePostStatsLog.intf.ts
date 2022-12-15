import { Schema } from "mongoose"

export interface IProfilePostStatsLog{
  _id?: Schema.Types.ObjectId
  _profile_id : Schema.Types.ObjectId,
  post_shortcode: string,
  comments: number
  lastComments?: number
  likes: number
  lastLikes?: number

  createdAt?: Date
}