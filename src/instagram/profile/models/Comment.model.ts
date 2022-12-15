import { IsNotEmpty, Min, MinLength } from 'class-validator'
import { validateOrReject } from 'class-validator';
import { Schema } from 'mongoose';
import { IPostComment } from 'src/instagram/api-handler/interfaces/dtos/PostCommentsResponse.dto';
import { IComment, SimpleUser } from 'src/instagram/shared/interfaces/Comment.intf';
import { CommentINTF as CreateCommentINTF } from 'src/shared/modules/database/interfaces/Comments/comment.intf';

//-------------------------------------------------

export class Comment implements IComment{
  @IsNotEmpty()
  ig_id: number

  @IsNotEmpty()
  post_shortcode: string

  @Min(0)
  likes: number

  media_id?: number
  share_enabled: boolean

  @MinLength(0)
  text: string

  private_reply_status: number
  reported_as_spam?: boolean
  content_type: string
  taken_at: number
  user: SimpleUser

	parent_comment_id?: number
	child_comment_count?: number
	has_liked_comment?: boolean
	did_report_as_spam?: boolean
	comment_index?: number


  constructor(commentINTF: Partial<IComment> = {}) {
    Object.assign(this, commentINTF);
    this.validateMembers()
  }

  validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }

  toCreateCommentINTF(profile_id: Schema.Types.ObjectId): CreateCommentINTF {
    try{
      const createCommentINTF: CreateCommentINTF = {
        ig_id: this.ig_id,
        post_shortcode: this.post_shortcode,
        post_owner_id: profile_id,
        user: this.user,
        likes: this.likes,
        share_enabled: this.share_enabled,
        text: { text: this.text },
        private_reply_status: this.private_reply_status,
        taken_at: this.taken_at,
        reported_as_spam: this.reported_as_spam,
        content_type: this.content_type,
        child_comment_count: this.child_comment_count,
        has_liked_comment: this.has_liked_comment,
        did_report_as_spam: this.did_report_as_spam,
        comment_index: this.comment_index,
      }
      if(this.parent_comment_id) createCommentINTF.parent_comment_id = this.parent_comment_id

      return createCommentINTF
    }catch(err) { throw err }
  }
}

export function commentINTFFromResponse(commentsResp: IPostComment, shortcode: string, isChild?: boolean): Comment[]{
  const comments: Comment[] = []
  const simpleUser: SimpleUser = {
    ig_id: commentsResp.user_id,
    username: commentsResp.user.username,
    full_name: commentsResp.user.full_name,
    is_private: commentsResp.user.is_private,
    is_verified: commentsResp.user.is_verified,
    is_mentionable: commentsResp.user.is_mentionable,
    has_anonymous_profile_picture: commentsResp.user.has_anonymous_profile_picture
  }
  
  const commentINTF: IComment = {
    ig_id: Number(commentsResp.pk),   //ig_id is a double
    post_shortcode: shortcode,
    likes: commentsResp.comment_like_count,
    share_enabled: commentsResp.share_enabled,
    text: commentsResp.text,
    private_reply_status: commentsResp.private_reply_status,
    reported_as_spam: commentsResp.did_report_as_spam,
    content_type: commentsResp.content_type,
    taken_at: commentsResp.created_at_utc,
    user: simpleUser,
    child_comment_count: commentsResp.child_comment_count,
    has_liked_comment: commentsResp.has_liked_comment,
    did_report_as_spam: commentsResp.did_report_as_spam,
    comment_index: commentsResp.comment_index,
  }
  const comment = new Comment(commentINTF)
  if(isChild) comment.parent_comment_id = Number(commentsResp.parent_comment_id)
  comments.push(comment)

  if(commentsResp.preview_child_comments?.length > 0){
    const childrenComments: Comment[] = []
    commentsResp.preview_child_comments.forEach( (childComment: IPostComment) => {
      const _childComment: IComment[] = this.commentINTFFromResponse(childComment, shortcode, true)
      childrenComments.push(new Comment(_childComment[0]))
    })
    comments.push(...childrenComments)
  }

  return comments
}
