import { HashtagDataDTO, HashtagDataINTF } from "../interfaces/dtos/hashtagData.dto";
import { HashtagPost } from './HashtagPost.model';
import { HashtagLog } from './HashtagLog.model';

export class HashtagData implements HashtagDataINTF{
  constructor(public hashtagLog: HashtagLog, public hashtagPosts: HashtagPost[]){}
  
  public toDTO(hashtagDataINTF: HashtagDataINTF): HashtagDataDTO{
    const hashtagDataDTO = new HashtagDataDTO(hashtagDataINTF)
    return hashtagDataDTO
  }

  getNewPosts(param: {postsToRemove: HashtagPost[]}): HashtagPost[]{
    const newHashtagPosts = this.hashtagPosts.filter((post) => {
      const postFound = param.postsToRemove.find(postToRemove => postToRemove.shortcode === post.shortcode)
      return !postFound ?? true
    })
    return newHashtagPosts || []
  }

}