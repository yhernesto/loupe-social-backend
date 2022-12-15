import { IKirtanProfilePost } from "./KirtanProfilePosts.dto";

export interface IKirtanFeedResponse {
  moreAvailable: boolean
  nextMaxId: string
  data: IKirtanProfilePost[]
  error: any
}
