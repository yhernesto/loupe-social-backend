import { IsBoolean, IsNotEmpty, IsUrl } from "class-validator";
import { IHashtagResponse, ImageVersion, KirtanHashtagPost, UserTag, Location } from "./Kirtan/KirtanHashtagResponse.dto";

export interface HashtagResponseINTF {
  id?: string,
  name: string,
  profile_pic_url?: string,
  edge_hashtag_to_top_posts: PostEdge,
  edge_hashtag_to_media: PostEdge,
  is_top_media_only?: boolean,
  is_following?: boolean,
  allow_following?: boolean,
}

// export interface PostEdge{
//   edges: PostElement[]
// }

export interface PostEdge{
  edges: PostElement[],
  count?: number,
  page_info?: PageInfo,
}


export interface PostElement {
  node: HashtagPostBodyRes;
}

// export interface MediaPostElement {
//   node: HashtagPostBodyRes;
// }


// --------------------------- Hashtag Post ----------------------------------- //
export interface HashtagPostBodyRes {
  id: string,
  display_url: string,
  shortcode: string,
  thumbnail_src?: string,
  edge_liked_by: countNumber,
  accessibility_caption?: string,
  taken_at_timestamp:number,
  dimensions: dimensions,
  owner: Owner,
  edge_media_to_caption: edge_media_to_caption,
  edge_media_preview_like: countNumber,
  is_video: boolean,
  edge_media_to_comment: countNumber,
  video_view_count?: number,
  device_timestamp?: string
  filter_type?: number
  carousel_media_count?: number
  can_see_insights_as_brand?: boolean
  location?: Location
  lat?: string
  lng?: string
  can_viewer_reshare?: boolean
  caption_is_edited?: boolean
  like_and_view_counts_disabled?: boolean
  commerciality_status?: string
  fundraiser_tag?: any
  is_paid_partnership?: boolean
  top_likers?: string[]
  photo_of_you?: boolean
  usertags?: { in: UserTag[]}
  product_type?: string
  is_in_profile_grid?: boolean
  integrity_review_decision?: string
  music_metadata?: any
}

export interface countNumber {
  count: number
}

export interface dimensions {
  width: number,
  height: number,
}

export interface Owner {
  id: string,
  username?: string,
  full_name?: string
}

export interface edge_media_to_caption{
  edges: TextElement[]
}
export interface TextElement {
  node: TextNode;
}

export interface TextNode {
  text: string
  has_translation?: boolean
}


// --------------------------- Media Post ----------------------------------- //
export interface PageInfo{
  end_cursor: string,
  has_next_page: boolean,
}

export class HashtagResponseDTO{
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsUrl()
  profile_pic_url: string;

  edge_hashtag_to_top_posts: PostEdge;

  edge_hashtag_to_media: PostEdge;

  @IsBoolean()
  is_top_media_only: boolean;

  @IsBoolean()
  is_following: boolean;

  @IsBoolean()
  allow_following: boolean;

  constructor(psadbroHashtagResponseINTF: HashtagResponseINTF){
    this.id = psadbroHashtagResponseINTF.id
    this.name = psadbroHashtagResponseINTF.name
    this.profile_pic_url = psadbroHashtagResponseINTF.profile_pic_url
    this.edge_hashtag_to_media =  psadbroHashtagResponseINTF.edge_hashtag_to_media
    this.edge_hashtag_to_top_posts = psadbroHashtagResponseINTF.edge_hashtag_to_top_posts
    this.is_top_media_only = psadbroHashtagResponseINTF.is_top_media_only
    this.allow_following = psadbroHashtagResponseINTF.allow_following
  }
}

export function hashtagPostsINTFfromKirtanRes(hashtag: string, kirtanTopResp: IHashtagResponse, kirtanFeedResp: IHashtagResponse): HashtagResponseINTF{
  const topPost: PostEdge = kirtanResponseToPostEdge(kirtanTopResp)
  const feedPost: PostEdge = kirtanResponseToPostEdge(kirtanFeedResp)
  
  const hashtagResponse: HashtagResponseINTF = {
    name: hashtag,
    edge_hashtag_to_top_posts: topPost,
    edge_hashtag_to_media: feedPost
  }
  return hashtagResponse
}

function kirtanResponseToPostEdge(kirtanProfileResp: IHashtagResponse): PostEdge {
  const postElements: PostElement[] = []
  kirtanProfileResp.data.forEach((kirtanHPost: KirtanHashtagPost) => {
    if(kirtanHPost){
      let image: ImageVersion
      if(kirtanHPost.carousel_media){
        image = kirtanHPost.carousel_media[0].image_versions2
      }else{
        image = kirtanHPost.image_versions2
      }

      const textElements: TextElement[] = [
        {node: {
          text: kirtanHPost.caption.text, 
          has_translation: kirtanHPost.caption.has_translation}
        }]
      const caption: edge_media_to_caption = {
        edges: textElements
      }

      const postElement: PostElement = {
        node: {
          id: kirtanHPost.id,
          shortcode: kirtanHPost.code,
          edge_liked_by: { count: kirtanHPost.like_count },
          taken_at_timestamp: kirtanHPost.taken_at,
          display_url: image.candidates[0].url,
          dimensions: {height: image.candidates[0].height, width: image.candidates[0].height},
          owner: { id: kirtanHPost.user.pk.toString(), username: kirtanHPost.user.username, full_name: kirtanHPost.user.full_name },
          edge_media_to_caption: caption,
          edge_media_preview_like: { count: 0 },
          is_video: kirtanHPost.media_type != 0,
          edge_media_to_comment: { count: kirtanHPost.comment_count },
          video_view_count: 0, //TODO
          device_timestamp: kirtanHPost.device_timestamp,
          filter_type: kirtanHPost.filter_type ,
          carousel_media_count: kirtanHPost.carousel_media_count,
          can_see_insights_as_brand: kirtanHPost.can_see_insights_as_brand,
          location: kirtanHPost.location,
          lat: kirtanHPost.lat,
          lng: kirtanHPost.lng,
          can_viewer_reshare: kirtanHPost.can_viewer_reshare,
          caption_is_edited: kirtanHPost.caption_is_edited,
          like_and_view_counts_disabled: kirtanHPost.like_and_view_counts_disabled, 
          commerciality_status: kirtanHPost.commerciality_status,
          fundraiser_tag: kirtanHPost.fundraiser_tag,
          is_paid_partnership: kirtanHPost.is_paid_partnership, 
          top_likers: kirtanHPost.top_likers,
          photo_of_you: kirtanHPost.photo_of_you,
          usertags: kirtanHPost.usertags,
          product_type: kirtanHPost.product_type,
          is_in_profile_grid: kirtanHPost.is_in_profile_grid, 
          integrity_review_decision: kirtanHPost.integrity_review_decision,
          music_metadata: kirtanHPost.music_metadata
        }
      }
      postElements.push(postElement)
    }
  })

  const postEdge: PostEdge = { edges: postElements }
  return postEdge
}