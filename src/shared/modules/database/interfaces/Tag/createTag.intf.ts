import { Schema } from 'mongoose';

export interface video_props {
  start_time_in_video: number,
  duration_in_video: number
}

export interface position {
  x: number,
  y: number
}

export interface CreateTagINTF{
  _id?: Schema.Types.ObjectId
  post_shortcode: string
  owner_id: Schema.Types.ObjectId
  tagged_id: Schema.Types.ObjectId
  position: position
  video?: video_props
  createdAt?: Date
}