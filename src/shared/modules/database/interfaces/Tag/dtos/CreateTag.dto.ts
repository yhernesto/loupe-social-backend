import { IsNotEmpty, IsObject, IsOptional } from 'class-validator'
import { video_props, position, CreateTagINTF } from '../createTag.intf'
import { validateOrReject } from 'class-validator';
import { Schema } from 'mongoose';


export class CreateTagDTO implements CreateTagINTF{
  _id?: Schema.Types.ObjectId

  @IsNotEmpty()
  post_shortcode: string

  @IsNotEmpty()
  owner_id: Schema.Types.ObjectId

  @IsNotEmpty()
  tagged_id: Schema.Types.ObjectId

  @IsOptional()
  @IsObject()
  video?: video_props

  @IsObject()
  position: position

  constructor(userTagINTF: Partial<CreateTagINTF> = {}) {
    Object.assign(this, userTagINTF);
    this.validateMembers()
  }

  validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }
}