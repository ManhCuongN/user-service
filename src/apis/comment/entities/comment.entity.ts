import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.Mixed })
  author?: Record<string, any>;

  @Prop()
  discuss_id?: string;

  @Prop()
  posted?: string;

  @Prop()
  parent_slug?: string;

  @Prop()
  text?: string;

  @Prop({default: 0})
  score?: number;

  @Prop()
  slug?: string;

  @Prop({default: 0})
  comment_replies_num?: number;

  @Prop({default: 0})
  comment_like_num?: number;

  

  @Prop()
  comment_likes?: any[];

  @Prop()
  full_slug?: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
