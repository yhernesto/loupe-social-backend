export interface hashtagRelation {
  hashtag: string,
  occurrences: number
}

export interface IResHashtagRelationRatio {
  relation_logs: hashtagRelation[],
  max: number,
  min: number
}

export class ResHashtagRelationRatioDTO implements IResHashtagRelationRatio {
  relation_logs: hashtagRelation[] = []
  max: number = null
  min: number = null

  public constructor(init?:Partial<IResHashtagRelationRatio>) {
    Object.assign(this, init);
  }
}