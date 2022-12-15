import { ITagPost } from "../../TagPost.intf";

export interface TagResponseDTO {
  moreAvailable: boolean
  nextMaxId: string
  data: ITagPost[]
  error: any
}
