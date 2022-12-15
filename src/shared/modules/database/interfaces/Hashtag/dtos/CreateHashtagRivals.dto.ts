import { IsBoolean, IsNotEmpty, IsObject } from "class-validator";
import { HashtagRivalINTF, Rival } from "../hashtagRival.intf";

export class CreateHashtagRivalDTO implements HashtagRivalINTF {
  @IsNotEmpty()
  hashtag: string

  @IsObject()
  rival: Rival

  @IsBoolean()
  active?: boolean
}