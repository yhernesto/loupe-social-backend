import { Controller, Get, Post, Body } from '@nestjs/common';
import { Create_tt_postDto } from '../interfaces/dtos/tt_post.dto';
import { Tt_postService } from '../services/tt_post.service';
import { Tt_post } from '../interfaces/tt_post.interface';

@Controller()
export class Tt_postController {
  constructor(private tt_postService: Tt_postService) {}

  @Post()
  async create(@Body() create_tt_postDto: Create_tt_postDto) {
    this.tt_postService.create(create_tt_postDto);
  }

  @Get()
  async findAll(): Promise<Tt_post[]> {
    return this.tt_postService.findAll();
  }
}