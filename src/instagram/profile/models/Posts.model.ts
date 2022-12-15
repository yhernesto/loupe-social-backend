import { PostResponseINTF } from '../interfaces/PostResponse.intf';
import { ProfileDTO } from '../../shared/interfaces/dtos/Profile.dto'
import { TagDTO } from '../../shared/interfaces/dtos/Tag.dto'
import { PlaceDTO } from 'src/instagram/shared/interfaces/dtos/Place.dto';
import { IsArray, IsObject, IsOptional, validateOrReject } from 'class-validator';
import { IImage } from 'src/instagram/shared/interfaces/dtos/Image.intf';
import { hashImageByUrl, strDay, strHour, strMinutes, strMonth, strSeconds, strYear } from 'src/shared/utils/Utils';
import { ProfilePostINTF, VideoVersion } from 'src/shared/modules/database/interfaces/Profile/ProfilePost.intf';
import { Schema } from 'mongoose';
import { Comment } from './Comment.model';
import { IComment } from 'src/instagram/shared/interfaces/Comment.intf';
import { ITagResponse } from '../interfaces/TagResponse.intf';

interface Caption{
  is_covered: boolean,
  text: string,
  share_enabled: boolean,
  reported_as_spam: boolean,
  content_type: string,
}

interface PostImage extends IImage{
  width: number,
  height: number
}

export interface Thumbnails {
  video_length: number
  thumbnail_width: number
  thumbnail_height: number
  thumbnail_duration: string
  sprite_urls: any
  thumbnails_per_row: number
  total_thumbnail_num_per_sprite: number
  max_thumbnails_per_sprite: number
  sprite_width: number
  sprite_height: number
  rendered_width: number
  file_size_kb: number
}

interface PostVideo{
  duration: number
  play_count: number
  url: string,
  width: number,
  height: number,
  view_count: number,
  versions: VideoVersion[],
  has_audio: boolean
  title?: string
  nearly_complete_copyright_match?: boolean
  media_cropping_info?: any
  thumbnails?: Thumbnails
  igtv_exists_in_viewer_series?: boolean
  is_post_live?: boolean
  video_codec?: string
  number_of_qualities?: number
}

interface UserTag{
  user_tagged: ProfileDTO,
  tag: TagDTO
}

export class Post {
  shortcode: string
  ig_id: string
  media_type: number  //1= image, 2=video

  @IsObject()
  caption: Caption

  @IsObject()
  profile: ProfileDTO

  comments_count: number
  likes_count: number

  @IsArray()
  comments: Comment[]

  @IsOptional()
  @IsObject()
  image?: PostImage

  longitude?: number
  latitude?: number

  @IsOptional()
  @IsObject()
  place?: PlaceDTO

  @IsOptional()
  @IsObject()
  video?: PostVideo

  has_liked: boolean

  @IsArray()
  usertags: UserTag[]
  organic_tracking_token: string
  height: number
  width: number
  can_see_insights_as_brand: boolean
  photo_of_you: boolean
  can_viewer_reshare: boolean
  comment_likes_enabled: boolean
  caption_is_edited: boolean
  facepile_top_likers: unknown
  is_paid_partnership: boolean
  integrity_review: string
  should_request_ads: boolean
  // view_count: number
  // has_audio: boolean
  // play_count: number
  taken_at: number

  constructor(responsePost: PostResponseINTF | ITagResponse){
    const ownerProfile: ProfileDTO = this.getOwnerProfile(responsePost)
    const caption: Caption = this.getCaption(responsePost)
    const place: PlaceDTO = this.getPlace(responsePost) 
    const image: PostImage = this.getPostImage(responsePost)
    const video: PostVideo = this.getPostVideo(responsePost)
    const comments: Comment[] = this.getComments(responsePost)
    
    this.shortcode = responsePost.code
    this.ig_id = responsePost.pk
    this.media_type = responsePost.media_type
    this.caption = caption
    this.profile= ownerProfile
    this.image= image
    this.video= video
    this.longitude= responsePost.lng
    this.latitude= responsePost.lat
    this.place= place
    this.comments = comments
    this.comments_count= responsePost.comment_count
    this.likes_count= responsePost.like_count
    this.has_liked= responsePost.has_liked
    this.organic_tracking_token= responsePost.organic_tracking_token
    this.height= responsePost.original_height
    this.width= responsePost.original_width
    this.can_see_insights_as_brand= responsePost.can_see_insights_as_brand
    this.photo_of_you= responsePost.photo_of_you
    this.can_viewer_reshare= responsePost.can_viewer_reshare
    this.comment_likes_enabled= responsePost.comment_likes_enabled
    this.caption_is_edited= responsePost.caption_is_edited
    this.is_paid_partnership= responsePost.is_paid_partnership
    this.integrity_review= responsePost.integrity_review_decision
    this.should_request_ads= responsePost.should_request_ads
    // this.view_count = responsePost.view_count
    // this.has_audio = responsePost.has_audio
    this.taken_at= responsePost.taken_at
    
    const userTags: UserTag[] = this.getUserTags(responsePost)
    this.usertags= userTags

    this.validateMembers()
  }


  private getOwnerProfile(responsePost: PostResponseINTF): ProfileDTO{
    const profileDTO: ProfileDTO = new ProfileDTO({
      ig_id: responsePost.user.pk,
      username: responsePost.user.username,
      full_name: responsePost.user.full_name,
      profile_pic: {
        source_url: responsePost.user.profile_pic_url,
      },
      is_verified: responsePost.user.is_verified,
      biography: ''
    })
    return profileDTO;
  }

  private getCaption(responsePost: PostResponseINTF): Caption{
    if(!responsePost.caption){
      return {} as Caption
    }

    const caption: Caption = {
      is_covered: responsePost.caption.is_covered,
      text: responsePost.caption.text,
      share_enabled: responsePost.caption.share_enabled,
      reported_as_spam: responsePost.caption.did_report_as_spam,
      content_type: responsePost.caption.content_type, //comment
    }
    return caption
  }

  private getUserTags(responsePost: PostResponseINTF): UserTag[]{
    const userTags: UserTag[] = []
    responsePost.usertags?.in?.forEach(usertag => {
      const userProfile: ProfileDTO = new ProfileDTO({
        ig_id: usertag.user.pk,
        username: usertag.user.username,
        full_name: usertag.user.full_name,
        profile_pic: {
          source_url: usertag.user.profile_pic_url
        },
        is_verified: usertag.user.is_verified,
        biography: ''
      })

      const tag: TagDTO = new TagDTO({
        owner_ig_id: this.profile.ig_id,
        post_shortcode: responsePost.code,
        video: {
          start_time_in_video: usertag.start_time_in_video_in_sec,
          duration_in_video: usertag.duration_in_video_in_sec
        },
        position: { x: usertag.position[0], y: usertag.position[1] },
        tagged_ig_id: userProfile.ig_id || null
      })
      userTags.push({user_tagged: userProfile, tag: tag})
    })
    return userTags
  }

  private getPlace(responsePost: PostResponseINTF): PlaceDTO {
    if(!responsePost.location){
      return {} as PlaceDTO
    }

    const placeINTF = {
      ig_id: responsePost.location.pk,
      name: responsePost.location.name,
      short_name: responsePost.location.short_name,
      city: responsePost.location.city,
      address: responsePost.location.address,
      latitude: responsePost.location.lat,
      longitude: responsePost.location.lng,
      facebook_places_id: responsePost.location.facebook_places_id,
    }
    const placeDTO = new PlaceDTO(placeINTF)
    return placeDTO
  }

  private getPostImage(responsePost: PostResponseINTF): PostImage{
    if(!responsePost.image_versions2){
      return {} as PostImage
    }
    const source_url = responsePost.image_versions2.candidates[0]?.url
    const image: PostImage = {
      width: responsePost.image_versions2.candidates[0]?.width,
      height: responsePost.image_versions2.candidates[0]?.height,
      source_url: source_url
    }
    return image
  }

  private getPostVideo(responsePost: PostResponseINTF): PostVideo{
    if(!responsePost.video_duration){
      return {} as PostVideo
    }

    const video: PostVideo = {
      play_count: responsePost.play_count,
      duration: responsePost.video_duration,
      url: responsePost.video_versions[0]?.url,
      width: responsePost.video_versions[0]?.width,
      height: responsePost.video_versions[0]?.height,
      versions: responsePost.video_versions,
      view_count: responsePost.view_count,
      has_audio: responsePost.has_audio,
      title: responsePost.title,
      nearly_complete_copyright_match: responsePost.nearly_complete_copyright_match,
      media_cropping_info: responsePost.media_cropping_info,
      thumbnails: responsePost.thumbnails,
      igtv_exists_in_viewer_series: responsePost.igtv_exists_in_viewer_series,
      is_post_live: responsePost.is_post_live,
      video_codec: responsePost.video_codec,
      number_of_qualities: responsePost.number_of_qualities
    }
    return video
  }

  private getComments(responsePost: PostResponseINTF): Comment[]{
    const comments: Comment[] = []
    
    if(Array.isArray(responsePost.comments)){
      responsePost.comments?.forEach(comment => {
        const ig_id = (typeof comment.pk === 'string') ? Number(comment.pk) : comment.pk
        const commentINTF: IComment = {
          ig_id: ig_id,
          post_shortcode: responsePost.code,
          likes: comment.comment_like_count,
          media_id: comment.media_id,
          share_enabled: comment.share_enabled,
          user: { ig_id: comment.user_id},
          text: comment.text,
          private_reply_status: comment.private_reply_status,
          taken_at: comment.created_at_utc,
          reported_as_spam: comment.did_report_as_spam,
          content_type: comment.content_type,
        }
        const commentDTO: Comment = new Comment(commentINTF)
        comments.push(commentDTO)
      })
    }
    return comments
  }

  //************************************************************************************************** */
  //************************************************************************************************** */
  async getCreateProfilePostINTF(params: {profile_id: Schema.Types.ObjectId, place_id: Schema.Types.ObjectId, old_post_img: PostImage}): Promise<ProfilePostINTF>{
    const {profile_id, place_id, old_post_img} = params
    if(!old_post_img){
      this.image.hash = await this.getPictureHash()
      this.image.name = this.getPictureName()
    }else{
      this.image = old_post_img
    }

    const createProfilePostINTF: ProfilePostINTF = {
      shortcode: this.shortcode,
      ig_id: this.ig_id,
      media_type: this.media_type,  //1= image, 2=video
      text: { text: this.caption.text },
      content_type: this.caption.content_type,
      is_covered: this.caption.is_covered,
      share_enabled: this.caption.share_enabled,
      reported_as_spam: this.caption.reported_as_spam,
      _profile_id: profile_id,
      comments_count: this.comments_count,
      likes_count: this.likes_count,
      image: this.image,
      video: this.video,
      place: place_id,
      has_liked: this.has_liked,
      height: this.height,
      width: this.width,
      can_viewer_reshare: this.can_viewer_reshare,
      comment_likes_enabled: this.comment_likes_enabled,
      caption_is_edited: this.caption_is_edited,
      organic_tracking_token: this.organic_tracking_token, 
      can_see_insights_as_brand: this.can_see_insights_as_brand,
      photo_of_you: this.photo_of_you,
      facepile_top_likers: this.facepile_top_likers,
      is_paid_partnership: this.is_paid_partnership,
      integrity_review: this.integrity_review,
      should_request_ads: this.should_request_ads,
      taken_at: this.taken_at
    }
    return createProfilePostINTF
  }

  private async getPictureHash(): Promise<string> {
    if(this.image.source_url){
      try{
        return await hashImageByUrl(this.image.source_url)
      }catch(e){
        throw e
      }
    }
    return null
  }

  private getPictureName(): string {
    if(this.image.source_url && this.shortcode){
      try{
        const now = new Date()
        return this.shortcode + '-' + strYear(now, true) + strMonth(now) + strDay(now) + '_' + strHour(now) + strMinutes(now) + strSeconds(now)
      }catch(e){
        throw e
      }
    }
    return null
  }

  validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }
}