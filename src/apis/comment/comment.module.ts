import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema,Comment } from './entities/comment.entity';
import {CommentController} from "./controllers/comment.controller"
import { CommentService } from './services/comment.service';
import { Star, StarSchema } from './entities/star.entity';
@Module({
  imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }, { name: Star.name, schema: StarSchema }])],
  controllers: [CommentController ],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
