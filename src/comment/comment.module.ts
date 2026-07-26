import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comment.service'; // Utiliser CommentsService au lieu de CommentService
import { CommentsController } from './comment.controller'; // Utiliser CommentsController au lieu de CommentController
import { Comment } from './entities/comment.entity';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Project, User])],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {} // Le nom de la classe doit correspondre à l'export