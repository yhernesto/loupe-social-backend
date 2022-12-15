import { IsArray, IsNotEmpty } from "class-validator";
import { HashtagLog } from '../../models/HashtagLog.model'
import { HashtagPost } from '../../models/HashtagPost.model'

export interface HashtagDataINTF{
  hashtagLog: HashtagLog
  hashtagPosts: HashtagPost[]
}

export class HashtagDataDTO{
  @IsNotEmpty()
  hashtagLog: HashtagLog

  @IsArray()
  hashtagPosts: HashtagPost[]

  constructor(hashtagDataINTF: HashtagDataINTF){
    this.hashtagLog = hashtagDataINTF.hashtagLog
    this.hashtagPosts = hashtagDataINTF.hashtagPosts
  }
}