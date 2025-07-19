import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommentRepository } from './repositories/comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async create(createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    return this.commentRepository.create(createCommentDto, userId);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.findAll();
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne(id);
    if (!comment) {
      throw new NotFoundException(`Comentário com ID ${id} não encontrado`);
    }
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<Comment> {
    const comment = await this.findOne(id);
    
    // Verificar se o usuário é o autor do comentário
    if (comment.user_id !== userId) {
      throw new ForbiddenException('Você só pode editar seus próprios comentários');
    }

    const [affectedCount, updatedComments] = await this.commentRepository.update(id, updateCommentDto);
    
    if (affectedCount === 0) {
      throw new NotFoundException(`Comentário com ID ${id} não encontrado`);
    }

    return updatedComments[0];
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.findOne(id);
    
    // Verificar se o usuário é o autor do comentário
    if (comment.user_id !== userId) {
      throw new ForbiddenException('Você só pode excluir seus próprios comentários');
    }

    const deletedCount = await this.commentRepository.remove(id);
    
    if (deletedCount === 0) {
      throw new NotFoundException(`Comentário com ID ${id} não encontrado`);
    }
  }

  async findByUserId(userId: string): Promise<Comment[]> {
    return this.commentRepository.findByUserId(userId);
  }
}

