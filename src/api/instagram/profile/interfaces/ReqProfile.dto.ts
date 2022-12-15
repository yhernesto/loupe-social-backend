import { IsNotEmpty, IsNumberString } from "class-validator";

export interface ReqProfileINTF {
  profile_ig_id: number
}

export class ReqProfileDTO implements ReqProfileINTF{
  @IsNotEmpty()
  @IsNumberString()
  profile_ig_id: number
}