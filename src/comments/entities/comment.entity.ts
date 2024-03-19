import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  postId: string;

  @Prop({ required: true })
  text: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
