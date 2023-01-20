import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async getBlogs() {
    return await this.blogService.getBlogs();
  }

  @Get('/search')
  async getBlogsByTitle(@Body('key') key: string) {
    return await this.blogService.getByTitle(key);
  }

  @Get(':id')
  async getBlog(@Param('id') blogId: string) {
    return await this.blogService.getBlog(blogId);
  }

  @Post()
  async addBlog(
    @Body('title') title: string,
    @Body('author') author: string,
    @Body('content') content: string,
  ) {
    return await this.blogService.addBlog(title, author, content);
  }

  @Patch('/inc/:id')
  async incBlog(@Param('id') blogid: string) {
    return await this.blogService.incrementVote(blogid);
  }

  @Patch('/dec/:id')
  async decBlog(@Param('id') blogid: string) {
    return await this.blogService.decrementVote(blogid);
  }

  @Patch('/update/:id')
  async updateBlog(
    @Param('id') blogid: string,
    @Body('content') content: string,
  ) {
    return await this.blogService.updateBlog(blogid, content);
  }

  @Delete(':id')
  async deleteBlog(@Param('id') blogid: string) {
    return await this.blogService.deleteBlog(blogid);
  }
}
