import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment)
    private readonly commentModel: typeof Comment,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    return this.commentModel.create({
      content: createCommentDto.content,
      user_id: userId,
    } as any);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentModel.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(id: string): Promise<Comment | null> {
    return this.commentModel.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<[number, Comment[]]> {
    return this.commentModel.update(updateCommentDto, {
      where: { id },
      returning: true,
    });
  }

  async remove(id: string): Promise<number> {
    return this.commentModel.destroy({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Comment[]> {
    return this.commentModel.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }
}

