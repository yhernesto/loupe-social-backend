import { IsNotEmpty, IsObject, IsOptional, Min, validateOrReject } from "class-validator";
import { IImage } from "src/instagram/shared/interfaces/dtos/Image.intf";
import { ProfileStatsLogINTF } from '../ProfileStatsLog.intf'

export class CreateProfileStatsLogDTO implements ProfileStatsLogINTF{
  @IsNotEmpty()
  user_ig_id: number   //PK

  @Min(0)
  media_count: number
  
  @Min(0)
  following_count: number

  @Min(0)
  follower_count: number

  @Min(0)
  total_igtv_videos: number

  @Min(0)
  total_clips_count: number

  @Min(0)
  total_ar_effects: number

  @Min(0)
  usertags_count: number
  
  @Min(0)
  mutual_followers_count: number

  @IsOptional()
  @IsObject()
  profile_pic?: IImage

  constructor(profileStatsLogINTF: Partial<ProfileStatsLogINTF> = {}) {
    Object.assign(this, profileStatsLogINTF);
    this.validateMembers()
  }

  private validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }
}