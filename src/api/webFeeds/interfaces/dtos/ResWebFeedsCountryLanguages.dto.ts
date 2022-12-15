export interface ResWebFeedsCountryLanguagesINTF {
  country: string
  languages: string[]
}

/*
export class ReqWebFeedsCountryLangDTO implements ReqWebFeedsCountryLangINTF {
  @IsISO31661Alpha2()
  country: string

  @IsAlpha()
  @Length(2,2)
  lang: string

  // constructor(){
  //  DTOs used for HTTP communication doesn't need constructor because validation of its members is done in ValidationPipe
  // }
}
*/