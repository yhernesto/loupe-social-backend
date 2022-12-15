import { HashtagPost } from './HashtagPost.model'
import { HashtagPostModelINTF, media_type } from '../interfaces/HashtagPost.intf'
import { HashtagResponseDTO, HashtagPostBodyRes } from '../../api-handler/interfaces/dtos/HashtagResponse.dto'

export class RawHashtagPosts{
  private posts: Map<string, HashtagPost>
  hashtagName: string
  hashtagResponse: HashtagResponseDTO
	totalPostsSize: number
	mediaPostsSize: number
	topPostsSize: number

  constructor(params: {hashtagName: string, hashtagResponseDTO: HashtagResponseDTO}){
    this.hashtagName = params.hashtagName
    this.hashtagResponse = params.hashtagResponseDTO
    this.posts = new Map<string, HashtagPost>()
		this.totalPostsSize = 0
		this.mediaPostsSize = 0
		this.topPostsSize = 0
  }

  addTopPosts(){
		if(this.hashtagResponse?.edge_hashtag_to_top_posts){
			this.hashtagResponse.edge_hashtag_to_top_posts.edges?.forEach(top_post => {
				const topPostBodyRes: HashtagPostBodyRes = <HashtagPostBodyRes>(top_post.node as unknown)
					const topPost = this.parsePostBodyRestToHashtagPost(topPostBodyRes)
					topPost.is_top = true
					this.posts.set(topPost.shortcode, topPost)
					this.totalPostsSize = this.totalPostsSize + 1
					this.topPostsSize = this.topPostsSize + 1
				}
			)
		}
  }

  addMediaPosts(){
		if(this.hashtagResponse?.edge_hashtag_to_media){
			this.hashtagResponse.edge_hashtag_to_media.edges?.forEach(media_post => {
				const mediaPostBodyRes: HashtagPostBodyRes = <HashtagPostBodyRes>(media_post.node as unknown)
				const mediaPost = this.parsePostBodyRestToHashtagPost(mediaPostBodyRes)
				mediaPost.is_top = false
				this.posts.set(mediaPost.shortcode, mediaPost)
				this.totalPostsSize = this.totalPostsSize + 1
				this.mediaPostsSize = this.mediaPostsSize + 1
			})
		}
  }

	private parsePostBodyRestToHashtagPost(topPostBodyRes: HashtagPostBodyRes): HashtagPost {
		const hashtagPostINTF: HashtagPostModelINTF = {
			ig_id: Number.parseInt(topPostBodyRes.id),
			shortcode : topPostBodyRes.shortcode,
			hashtag : this.hashtagName,
			image_src : topPostBodyRes.display_url,
			media_type : topPostBodyRes.is_video ? media_type.video : media_type.image,
			account_id : Number.parseInt(topPostBodyRes.owner.id),
			dimensions : topPostBodyRes.dimensions,
			likes : topPostBodyRes.edge_liked_by.count,
			comments : topPostBodyRes.edge_media_to_comment.count,
			text : topPostBodyRes.edge_media_to_caption.edges[0].node.text,
			username: topPostBodyRes.owner.username,
			carousel_media_count: topPostBodyRes.carousel_media_count,
			can_see_insights_as_brand: topPostBodyRes.can_see_insights_as_brand,
			is_paid_partnership: topPostBodyRes.is_paid_partnership,
			accessibility_caption: topPostBodyRes.accessibility_caption,
			location: topPostBodyRes.location,
			taken_at_timestamp : topPostBodyRes.taken_at_timestamp,
			is_top: null,
		}
		return new HashtagPost(hashtagPostINTF)
	}

	getAllPosts(): HashtagPost[]{
		return Array.from(this.posts.values())
	}
}