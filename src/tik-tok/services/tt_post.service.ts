import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tt_post, Tt_postDocument } from '../schemas/tt_post.schema';
import { Create_tt_postDto } from '../interfaces/dtos/tt_post.dto';

@Injectable()
export class Tt_postService {
  constructor(@InjectModel(Tt_post.name) private tt_postModel: Model<Tt_postDocument>) {}

  async create(create_tt_postDto: Create_tt_postDto): Promise<Tt_post> {
    const createdTt_post = new this.tt_postModel(create_tt_postDto);
    return createdTt_post.save();

      //e.getMessage().contains("duplicate key");
    
  }

  async findAll(): Promise<Tt_post[]> {
    return this.tt_postModel.find().exec();
  }
}
