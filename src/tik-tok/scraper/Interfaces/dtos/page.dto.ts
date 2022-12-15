import { IsNotEmpty, IsUrl } from "class-validator";

export class PageDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;
}