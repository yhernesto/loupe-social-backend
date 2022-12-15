export interface CountryINTF {
  iso2: string
  default_lang?: string
}

export class CountryDTO implements CountryINTF {
  iso2: string
  default_lang?: string
}