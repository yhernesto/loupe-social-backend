import { HashtagLogINTF } from '../../../shared/modules/database/interfaces/Hashtag/hashtagLog.intf'
import { CreateHashtagLogDTO } from '../../../shared/modules/database/interfaces/Hashtag/dtos/CreateHashtagLog.dto'

export class HashtagLog{
  hashtag: string
  profile_image_src: string
  posts: number

  constructor(hashtagLogINTF: HashtagLogINTF){
    this.hashtag = hashtagLogINTF.hashtag,
    this.profile_image_src = hashtagLogINTF.profile_image_src,
    this.posts = hashtagLogINTF.posts
  }

  toCreateHashtagLogDTO(): CreateHashtagLogDTO{
    const createHashtagLogDTO = new CreateHashtagLogDTO({
      hashtag: this.hashtag,
      posts: this.posts,
      profile_image_src: this.profile_image_src
    })
    return createHashtagLogDTO
  }
}