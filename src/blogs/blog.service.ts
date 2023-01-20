import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog.model';

@Injectable()
export class BlogService {
  constructor(@InjectModel('Blog') private BlogModel: Model<Blog>) {}

  getBlogs = async () => {
    try {
      const blogs = await this.BlogModel.find();
      return blogs;
    } catch (error) {
      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  getBlog = async (blogid: string) => {
    try {
      const blog = await this.BlogModel.findOne({ _id: blogid });
      if (blog) return blog;

      throw new HttpException('blog not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  getByTitle = async (key: string) => {
    try {
      const blogs = await this.BlogModel.find({
        $or: [
          { title: { $regex: key } },
          { author: { $regex: key } },
          { content: { $regex: key } },
        ],
      });
      if (blogs.length !== 0) return blogs;
      throw new HttpException('blogs not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  addBlog = async (title: string, author: string, content: string) => {
    try {
      const blogs = await this.BlogModel.find();

      const filtredBlogs = blogs.filter((blog) => {
        return blog.author === author && blog.title === title;
      });

      if (filtredBlogs.length === 0) {
        const newBlog = new this.BlogModel({
          title,
          author,
          content,
          upvotes: 0,
          downvotes: 0,
        });
        const createdblog = await newBlog.save();
        return createdblog._id;
      }
      throw new HttpException('blog already exists', HttpStatus.CONFLICT);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  incrementVote = async (blogId: string) => {
    try {
      const blog = await this.BlogModel.findOne({ _id: blogId });

      if (blog) {
        await this.BlogModel.updateOne(
          { _id: blogId },
          { $inc: { upvotes: 1 } },
        );
        return { message: 'icrement successfully updated' };
      }

      throw new HttpException('blog does not exists', HttpStatus.CONFLICT);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  decrementVote = async (blogId: string) => {
    try {
      const blog = await this.BlogModel.findOne({ _id: blogId });

      if (blog) {
        await this.BlogModel.updateOne(
          { _id: blogId },
          { $inc: { downvotes: 1 } },
        );
        return { message: 'decerement successfully updated' };
      }

      throw new HttpException('blog does not exists', HttpStatus.CONFLICT);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  updateBlog = async (blogId: string, content: string) => {
    try {
      const user = await this.BlogModel.findById(blogId);

      if (user) {
        const updatedBlog = await this.BlogModel.findByIdAndUpdate(blogId, {
          content,
        });
        return updatedBlog._id;
      }
      throw new HttpException('blog not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  deleteBlog = async (blogId: string) => {
    try {
      const blog = await this.BlogModel.findOne({ _id: blogId });
      if (blog) {
        await this.BlogModel.deleteOne({ _id: blogId });
        return { message: 'blog successfully deleted' };
      }
      throw new HttpException('blog not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}
