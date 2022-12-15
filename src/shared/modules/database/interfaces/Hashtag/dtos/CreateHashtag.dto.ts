import { IsNotEmpty, IsPositive, IsUrl } from "class-validator";
import { HashtagINTF } from "../hashtag.intf";

export class CreateHashtagDTO implements HashtagINTF{
  @IsNotEmpty()
  hashtag: string;

  @IsUrl()
  profile_image_src: string;

  @IsPositive()
  posts: number;

  @IsPositive()
  sentiment_score?: number;
}
