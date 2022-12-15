export interface Rival {
  hashtag: string,
  sector?: string
}

export interface HashtagRivalINTF {
  hashtag: string,
  rival: Rival,
  active?: boolean,
  updatedAt?: Date,
  createdAt?: Date
}