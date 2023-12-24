import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../entities/comment.entity'; // Đảm bảo đường dẫn đúng tới model của Comment
import { v4 as uuidv4 } from 'uuid';
import { text } from 'stream/consumers';
import { Star, StarDocument } from '../entities/star.entity';
@Injectable()
export class CommentService {
	constructor(
		@InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
		@InjectModel(Star.name) private starModel: Model<StarDocument>
	) {}

	async createComment(body): Promise<Comment> {
		var { author, discuss_id, text, parent_slug } = body;
		if (parent_slug) {
			parent_slug = parent_slug;
		} else {
			parent_slug = '';
		}
		const posted = new Date();
		let slug = uuidv4();
		let full_slug = `${posted.toISOString()}:${slug}`;
		const parentSlug = await this.commentModel.findOne({ discuss_id, slug: parent_slug });
		if (parentSlug) {
			//comment child
			if (parentSlug.comment_replies_num !== undefined) {
				parentSlug.comment_replies_num += 1;
			}
			full_slug = `${parentSlug.full_slug}/${full_slug}`;
			slug = `${parentSlug.slug}/${slug}`;
			await parentSlug.save(); // Lưu lại thay đổi vào CSDL
		}
		const createdComment = new this.commentModel({
			parent_slug,
			discuss_id,
			text,
			author,
			slug,
			full_slug
		});
		return createdComment.save();
	}

	async listComment(body) {
		const { slug = '', parent_slug, replies, limit, discuss_id } = body;
		try {
			const match = { discuss_id };
			if (slug !== '') {
				match['full_slug'] = new RegExp(slug, 'i');
			}
			if (slug == '') {
				const parent_slug = '';
				const commentParent = await this.commentModel
					.find({ parent_slug })
					.sort({ full_slug: 1 });
				return commentParent;
			}
			console.log(match);
			const comment = await this.commentModel
				.find({ parent_slug: slug })
				.sort({ full_slug: 1 });

			// Trích xuất và chỉ trả về dữ liệu cần thiết

			return comment;
		} catch (error) {
			console.log('err', error);
			throw new BadRequestException(error);
		}
	}

	//update
	async updateComment(body) {
		const { text, slug } = body;

		// Sử dụng findOneAndUpdate để cập nhật dữ liệu
		const updatedComment = await this.commentModel.findOneAndUpdate(
			{ slug }, // Điều kiện để tìm bản ghi cần cập nhật
			{ text }, // Dữ liệu mới bạn muốn cập nhật
			{ new: true } // Tùy chọn để trả về bản ghi sau khi cập nhật
		);

		return updatedComment;
	}
	async deleteComment(body) {
		const { slug } = body;
		const deleteCmt = await this.commentModel.findOneAndDelete({ slug });
		return deleteCmt;
	}

	async likeComment(body) {
		const { idComment, user } = body;

		// Tìm bản ghi comment cần cập nhật
		const commentToUpdate = await this.commentModel.findById(idComment);

		if (!commentToUpdate) {
			// Xử lý trường hợp không tìm thấy comment
			return new BadRequestException('No found comment');
		}

		// Kiểm tra nếu comment_likes là một mảng và có giá trị
		if (commentToUpdate.comment_likes && Array.isArray(commentToUpdate.comment_likes)) {
			// Kiểm tra nếu user đã like comment trước đó
			const hasLiked = commentToUpdate.comment_likes.some(
				(likedUser) => likedUser.idUser === user.idUser
			);
			if (hasLiked) {
				commentToUpdate.comment_likes = commentToUpdate.comment_likes.filter(
					(likedUser) => likedUser.idUser !== user.idUser
				);
				commentToUpdate.comment_like_num = (commentToUpdate.comment_like_num ?? 0) - 1; // Giảm số lượt thích
			} else {
				commentToUpdate.comment_likes.push(user);
				commentToUpdate.comment_like_num = (commentToUpdate.comment_like_num ?? 0) + 1; // Cập nhật số lượt thích
			}

			// Lưu bản ghi đã cập nhật
			const updatedComment = await commentToUpdate.save();
			return updatedComment;
		} else {
			// Xử lý trường hợp comment_likes không tồn tại hoặc không phải là mảng
			return null;
		}
	}

	async reviewStar(body) {
		const { user, numStar, discuss_id } = body;
		const data = {
			user,
			star: numStar
		};
		try {
			let discuss = await this.starModel.findOne({ discuss_id: discuss_id });

			if (!discuss) {
				// Nếu chưa tồn tại đánh giá, tạo mới
				const newStar = {
					discuss_id,
					userAndStar: [data],
					num_star: 1
				};
				discuss = await this.starModel.create(newStar);
			} else {
				// Kiểm tra xem người dùng đã đánh giá chưa
				const existingReviewIndex = discuss.userAndStar.findIndex(
					(review) => review.user.idUser === user.idUser
				);

				if (existingReviewIndex !== -1) {
					// Nếu người dùng đã đánh giá, thay thế đánh giá cũ bằng dữ liệu mới
					discuss.userAndStar[existingReviewIndex] = data;
				} else {
					// Nếu chưa đánh giá, thêm đánh giá mới vào danh sách
					discuss.userAndStar.push(data);
				}

				discuss.num_star = discuss.userAndStar.length; // Cập nhật tổng số đánh giá
				discuss = await discuss.save(); // Cập nhật bản ghi
			}
           console.log("THanhc ong");
		   
			return discuss;
		} catch (error) {
			console.error('Lỗi:', error);
			throw new BadRequestException(error);
		}
	}

	async getListStar(discuss_id) {
   try {
	console.log(discuss_id);
	
	  const listStar = await this.starModel.findOne({discuss_id})
	  return listStar;
   } catch (error) {
	  throw new BadRequestException(error)
   }

	}
}
