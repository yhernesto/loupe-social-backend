import { UserINTF } from './User.intf'
import { IsAlpha, IsAlphanumeric, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateUserDTO implements Partial<UserINTF>{
  @IsOptional()
  @IsString()
  @IsAlphanumeric()
  user_name?: string

  @IsOptional()
  @IsAlpha()
  first_name?: string

  @IsOptional()
  @IsAlpha()
  last_name?: string

  @IsOptional()
  @IsNotEmpty()
  password?: string

  @IsOptional()
  @IsUrl()
  photo_url?: string;
}