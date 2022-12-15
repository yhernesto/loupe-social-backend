import { IsNotEmpty, Min, MinLength } from 'class-validator'
import { validateOrReject } from 'class-validator';
import { IComment, SimpleUser } from '../Comment.intf'

//-------------------------------------------------

export class CommentDTO implements IComment{
  @IsNotEmpty()
  ig_id: number

  @IsNotEmpty()
  post_shortcode: string

  @Min(0)
  likes: number

  media_id: number
  share_enabled: boolean

  @MinLength(0)
  text: string

  private_reply_status: number
  reported_as_spam: boolean
  content_type: string
  taken_at: number
  user: SimpleUser

  constructor(commentINTF: Partial<IComment> = {}) {
    Object.assign(this, commentINTF);
    this.validateMembers()
  }

  validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }
}