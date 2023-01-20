import mongoose from 'mongoose';

export const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  upvotes: { type: Number, required: true },
  downvotes: { type: Number, default: false },
});

export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  upvotes: number;
  downvotes: number;
}
