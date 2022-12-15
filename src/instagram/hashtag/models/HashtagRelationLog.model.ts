import { HashtagRelationLogINTF, HashtagRelationINTF } from '../../../shared/modules/database/interfaces/Hashtag/hashtagRelationLog.intf'
import { CreateHashtagRelationLogDTO } from '../../../shared/modules/database/interfaces/Hashtag/dtos/CreateHashtagRelationLog.dto'

export class HashtagRelationLog {
  parent: string
  relations: HashtagRelationINTF[];

  constructor(hashtagRelationLogDTOInterface: HashtagRelationLogINTF){
    this.parent = hashtagRelationLogDTOInterface.parent
    this.relations = hashtagRelationLogDTOInterface.relations
  }

  toCreateHashtagRelationLogDTO(): CreateHashtagRelationLogDTO{
    return new CreateHashtagRelationLogDTO({
      parent: this.parent,
      relations: this.relations
    })
  }
}