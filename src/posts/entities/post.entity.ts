import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class PostEntity {
  @Prop({ required: true })
  text: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: string;
}

export const PostSchema = SchemaFactory.createForClass(PostEntity);
