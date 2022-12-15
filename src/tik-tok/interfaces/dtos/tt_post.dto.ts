import { IsNotEmpty, IsPositive, IsUrl } from "class-validator";

export class Create_tt_postDto {
  @IsNotEmpty()
  tt_id: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;
  
  account_name: string;

  account_full_name: string;
  
  @IsPositive()
  likes: number;
  
  @IsPositive()
  comments: number;
  
  @IsPositive()
  shares: number;  

  song_title: string;  
  
  text: string;

  creation_date: Date;
}