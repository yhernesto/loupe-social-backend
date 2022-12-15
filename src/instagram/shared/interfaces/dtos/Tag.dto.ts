import { IsNotEmpty, IsObject } from 'class-validator'
import { validateOrReject } from 'class-validator';

export interface video_props {
  start_time_in_video: number,
  duration_in_video: number
}

export interface position {
  x: number,
  y: number
}

export interface TagINTF{
  post_shortcode: string
  owner_ig_id: number
  tagged_ig_id: number
  video: video_props
  position: position
}

export class TagDTO implements TagINTF{
  @IsNotEmpty()
  post_shortcode: string

  @IsNotEmpty()
  owner_ig_id: number

  @IsNotEmpty()
  tagged_ig_id: number

  @IsObject()
  video: video_props

  @IsObject()
  position: position

  constructor(tagINTF: TagINTF){
    this.post_shortcode = tagINTF.post_shortcode
    this.owner_ig_id = tagINTF.owner_ig_id
    this.tagged_ig_id= tagINTF.tagged_ig_id
    this.video= tagINTF.video
    this.position= tagINTF.position
    this.validateMembers()
  }

  validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }
}