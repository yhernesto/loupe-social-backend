import { IResReducedPost } from "./ResReducedPost.int"

export interface IReducedPostList {
    positives: IResReducedPost[]
    negatives: IResReducedPost[]
    neutrals: IResReducedPost[]
}