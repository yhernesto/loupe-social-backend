import { Schema } from "mongoose";
import { Ig_profile } from "src/shared/modules/database/schemas/ig-profile.schema";
import { IPlan } from "./Plan.intf";

export interface IClient {
  _id?: Schema.Types.ObjectId
  active: boolean
  name: string
  sector: string
  description: string
  plan: IPlan
  ig_official_profile: Ig_profile
  ig_official_hashtag: string
  ig_likesToBeInfluencer: number
  sub_hashtags?: string[]
  createdAt?: Date
  updatedAt?: Date
  photo_url: string
}