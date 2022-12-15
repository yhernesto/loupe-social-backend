export interface IImage {
  name?: string,
  hash?: string,
  source_url: string
}

export interface IPostImage extends IImage{
  width: number
  height: number
}