import { IsArray, Min } from "class-validator"
import { PostCaption, ProfilePostINTF as IProfilePost } from '../ProfilePost.intf'
import { IKirtanFeedResponse } from "./Kirtan/KirtanFeedResponse.dto"
import { IKirtanProfilePost } from "./Kirtan/KirtanProfilePosts.dto"
import { IKirtanProfileResponse } from "./Kirtan/KirtanProfileResponse.dto"

export interface IProfilePostsResponse {
  more_available: boolean,
  items: IProfilePost[],
  status: string,
  num_results: number,
  nextMaxId?: string,
  error?: any
}

export class ProfilePostsResponseDTO implements IProfilePostsResponse{
  more_available: boolean

  @IsArray()
  items: IProfilePost[]

  status: string

  @Min(0)
  num_results: number

  constructor(profilePostsResponseINTF: IProfilePostsResponse){
    this.more_available = profilePostsResponseINTF.more_available
    this.items = profilePostsResponseINTF.items
    this.status = profilePostsResponseINTF.status
    this.num_results = profilePostsResponseINTF.num_results
  }
}

export function profilePostINTFfromKirtanRes(kirtanProfileResponse: IKirtanProfileResponse): IProfilePostsResponse {
  const profilePosts: IProfilePost[] = []

  kirtanProfileResponse?.feed?.data?.forEach((kirtanPost: IKirtanProfilePost) => {
    const caption: PostCaption = {
      pk: kirtanPost.caption.pk,
      media_id: Number(kirtanPost.caption.media_id),
      is_covered: kirtanPost.caption.is_covered,
      user: kirtanPost.caption.user,
      text: kirtanPost.caption.text,
      share_enabled: kirtanPost.caption.share_enabled,
      did_report_as_spam: kirtanPost.caption.did_report_as_spam,
      content_type: kirtanPost.caption.content_type, //comment
      created_at_utc: kirtanPost.caption.created_at_utc
    }
    
    const profilePost: IProfilePost = {
      code: kirtanPost.code,
      pk: kirtanPost.pk,
      media_type: kirtanPost.media_type,  //1= image, 2=video
      facepile_top_likers: kirtanPost.top_likers,
      is_paid_partnership: kirtanPost.is_paid_partnership,
      integrity_review_decision: kirtanPost.integrity_review_decision,
      should_request_ads: kirtanPost.should_request_ads,
      lng: kirtanPost.lng,
      lat: kirtanPost.lat,
      location: kirtanPost.location,
      comment_count: kirtanPost.comment_count,
      has_liked: kirtanPost.has_liked,
      like_count: kirtanPost.like_count,
      comments: kirtanPost.preview_comments,  //verify
      usertags: kirtanPost.usertags,
      organic_tracking_token: kirtanPost.organic_tracking_token,
      original_height: kirtanPost.original_height,
      original_width: kirtanPost.original_width,
      can_see_insights_as_brand: kirtanPost.can_see_insights_as_brand,
      photo_of_you: kirtanPost.photo_of_you,
      can_viewer_reshare: kirtanPost.can_viewer_reshare,
      comment_likes_enabled: kirtanPost.comment_likes_enabled,
      caption_is_edited: kirtanPost.caption_is_edited,
      caption: caption,
      user: kirtanPost.user,
      product_type: kirtanPost.product_type,
      image_versions2: kirtanPost.image_versions2,
      video_duration: kirtanPost.video_duration,
      video_versions: kirtanPost.video_versions,
      title: kirtanPost.title,
      play_count: kirtanPost.play_count,
      view_count: kirtanPost.view_count,
      has_audio: kirtanPost.has_audio,
      taken_at: kirtanPost.taken_at,
        // video properties
      nearly_complete_copyright_match: kirtanPost.nearly_complete_copyright_match,
      media_cropping_info: kirtanPost.media_cropping_info,
      thumbnails: kirtanPost.thumbnails,
      igtv_exists_in_viewer_series: kirtanPost.igtv_exists_in_viewer_series, 
      is_post_live: kirtanPost.is_post_live,
      number_of_qualities: kirtanPost.number_of_qualities
    }
    profilePosts.push(profilePost)
  })

  const profilePostRes: IProfilePostsResponse = {
    more_available: false,
    items: profilePosts,
    status: 'active',
    num_results: profilePosts.length,
  }
   
  return profilePostRes
}



export function profilePostINTFfromKirtanFeedRes(kirtanFeedResponse: IKirtanFeedResponse): IProfilePostsResponse {
  const profilePosts: IProfilePost[] = []

  kirtanFeedResponse?.data?.forEach((kirtanPost: IKirtanProfilePost) => {
    const caption: PostCaption = {
      pk: kirtanPost.caption.pk,
      media_id: Number(kirtanPost.caption.media_id),
      is_covered: kirtanPost.caption.is_covered,
      user: kirtanPost.caption.user,
      text: kirtanPost.caption.text,
      share_enabled: kirtanPost.caption.share_enabled,
      did_report_as_spam: kirtanPost.caption.did_report_as_spam,
      content_type: kirtanPost.caption.content_type, //comment
      created_at_utc: kirtanPost.caption.created_at_utc
    }
    
    const profilePost: IProfilePost = {
      code: kirtanPost.code,
      pk: kirtanPost.pk,
      media_type: kirtanPost.media_type,  //1= image, 2=video
      facepile_top_likers: kirtanPost.top_likers,
      is_paid_partnership: kirtanPost.is_paid_partnership,
      integrity_review_decision: kirtanPost.integrity_review_decision,
      should_request_ads: kirtanPost.should_request_ads,
      lng: kirtanPost.lng,
      lat: kirtanPost.lat,
      location: kirtanPost.location,
      comment_count: kirtanPost.comment_count,
      has_liked: kirtanPost.has_liked,
      like_count: kirtanPost.like_count,
      comments: kirtanPost.preview_comments,  //verify
      usertags: kirtanPost.usertags,
      organic_tracking_token: kirtanPost.organic_tracking_token,
      original_height: kirtanPost.original_height,
      original_width: kirtanPost.original_width,
      can_see_insights_as_brand: kirtanPost.can_see_insights_as_brand,
      photo_of_you: kirtanPost.photo_of_you,
      can_viewer_reshare: kirtanPost.can_viewer_reshare,
      comment_likes_enabled: kirtanPost.comment_likes_enabled,
      caption_is_edited: kirtanPost.caption_is_edited,
      caption: caption,
      user: kirtanPost.user,
      product_type: kirtanPost.product_type,
      image_versions2: kirtanPost.image_versions2,
      video_duration: kirtanPost.video_duration,
      video_versions: kirtanPost.video_versions,
      title: kirtanPost.title,
      play_count: kirtanPost.play_count,
      view_count: kirtanPost.view_count,
      has_audio: kirtanPost.has_audio,
      taken_at: kirtanPost.taken_at,
        // video properties
      nearly_complete_copyright_match: kirtanPost.nearly_complete_copyright_match,
      media_cropping_info: kirtanPost.media_cropping_info,
      thumbnails: kirtanPost.thumbnails,
      igtv_exists_in_viewer_series: kirtanPost.igtv_exists_in_viewer_series, 
      is_post_live: kirtanPost.is_post_live,
      number_of_qualities: kirtanPost.number_of_qualities
    }
    profilePosts.push(profilePost)
  })

  const profilePostRes: IProfilePostsResponse = {
    more_available: kirtanFeedResponse.moreAvailable,
    nextMaxId: kirtanFeedResponse.nextMaxId,
    items: profilePosts,
    status: 'active',
    num_results: profilePosts.length,
    error: kirtanFeedResponse.error
  }

  return profilePostRes
}