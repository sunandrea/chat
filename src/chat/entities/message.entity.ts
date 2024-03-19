import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Message {
  @Prop({ required: true })
  text: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  recipient: string;

  @Prop({ type: [String], default: [] })
  deletedFor: string[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
