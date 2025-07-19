import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CommentRepository } from './repositories/comment.repository';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Comment, User]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentRepository],
  exports: [CommentsService, CommentRepository],
})
export class CommentsModule {}

