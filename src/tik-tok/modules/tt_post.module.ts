import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tt_postController } from '../controllers/tt_post.controller';
import { Tt_postService } from '../services/tt_post.service';
import { Tt_post, Tt_postSchema } from '../schemas/tt_post.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tt_post.name, schema: Tt_postSchema }])],
  controllers: [Tt_postController],
  providers: [Tt_postService],
  exports: [Tt_postService]
})
export class Tt_postModule {}