import {CommentService} from "../services/comment.service"
import {Get,Controller, Post, Body, Patch, Res, Delete, Param} from '@nestjs/common';
import { UUID } from "crypto";
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 từ thư viện uuid

@Controller("/comments")
export class CommentController{
  constructor(
    private readonly commentService: CommentService
  ){}

  @Post()
  async comment(@Body() body) {
    return this.commentService.createComment(body);
    
  }

  @Post('/list')
  async listComment(@Body() body, @Res() res) {
    const data = await this.commentService.listComment(body)
     res.json(data)
     
  }

  @Patch('/update')
  async updateComment(@Body() body, @Res() res) {
    console.log("body",body);
    
    const data = await this.commentService.updateComment(body)
    res.json(data)
  }

  @Delete("/delete")
  async deleteComment(@Body() body, @Res() res) {
    const data = await this.commentService.deleteComment(body)
    res.json(data)
  }

  @Patch("/like")
  async likeComment(@Body() body, @Res() res) {
    const likeCmt = await this.commentService.likeComment(body);
    res.json(likeCmt)
  }

  //STAR
  @Post("/review/star")
  async reviewStar(@Body() body, @Res() res) {
    const star = await this.commentService.reviewStar(body)
    res.json(star);
  }

  @Get("get/star/:id")
  async getListStar(@Param() param: any, @Res() res ) {
     const list = await this.commentService.getListStar(param.id)
     res.json(list)
     
  }
}