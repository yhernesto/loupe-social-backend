import { IsNotEmpty, IsPositive, IsUrl } from "class-validator";
import { HashtagLogINTF } from '../hashtagLog.intf'

export class CreateHashtagLogDTO {
  @IsNotEmpty()
  hashtag: string;

  @IsUrl()
  profile_image_src: string;

  @IsPositive()
  posts: number;

  constructor(hashtagLogInterface: HashtagLogINTF){
    this.hashtag = hashtagLogInterface.hashtag
    this.posts = hashtagLogInterface.posts
    this.profile_image_src = hashtagLogInterface.profile_image_src
  }

}
